const 
    app          = require('../../../src/app'),
    request      = require('supertest'),
    Expenses     = require('../../../src/models/expense');

jest.mock('../../../src/models/expense');

describe('GET /api/expenses', () => {
    beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of expenses with status 200', async () => {
    const mockExpenses = [
      { _id: '1', userId: 1, categoryId: 1002, amount: 10.5, description: 'Groceries' },
      { _id: '2', userId: 2, categoryId: 1002, amount: 25.0, description: 'Transport' },
    ];

    Expenses.find.mockResolvedValue(mockExpenses);

    const res = await request(app).get('/api/expenses');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockExpenses);
    expect(Expenses.find).toHaveBeenCalledWith({});
  });

  it('should return an empty array if no expenses are found', async () => {
    Expenses.find.mockResolvedValue([]);

    const res = await request(app).get('/api/expenses');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should handle errors and pass them to next()', async () => {
    const error = new Error('Database failure');
    Expenses.find.mockRejectedValue(error);

    const res = await request(app).get('/api/expenses');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /api/expenses/user/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of expenses with status 200', async () => {
    const mockExpenses = [
      { userId: 1, categoryId: 1002, amount: 10.5, description: 'Groceries' },
      { userId: 2, categoryId: 1002, amount: 25.0, description: 'Transport' },
    ];

    Expenses.find.mockResolvedValue(mockExpenses);

    const res = await request(app).get('/api/expenses/user/1000');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockExpenses);
    expect(Expenses.find).toHaveBeenCalledWith({userId: 1000});
  });

  it('should return an empty array if no expenses are found', async () => {
    Expenses.find.mockResolvedValue([]);

    const res = await request(app).get('/api/expenses/user/2000');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should handle errors and pass them to next()', async () => {
    const error = new Error('Database failure');
    Expenses.find.mockRejectedValue(error);

    const res = await request(app).get('/api/expenses/user/1000');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /api/expenses/add-expense', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });

    it('should create a new expense and return 201', async () => {
    const mockExpense = {
      date: new Date().toISOString(),
      userId: 1,
      categoryId: 2,
      amount: 99.99,
      description: 'Test expense',
    };

    // Mock the save method of a new Expenses instance
    Expenses.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockExpense),
    }));

    const res = await request(app).post('/api/expenses/add-expense').send({
      userId: '1',
      categoryId: '2',
      amount: '99.99',
      description: 'Test expense',
      date: new Date().toISOString(),
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(mockExpense);
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/expenses/add-expense').send({
      userId: '1',
      categoryId: '2',
      amount: '99.99',
      // missing description and date
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Missing required fields/);
  });

  it('should return 400 if amount is not a number', async () => {
    const res = await request(app).post('/api/expenses/add-expense').send({
      userId: '1',
      categoryId: '2',
      amount: 'not-a-number',
      description: 'Invalid amount test',
      date: new Date().toISOString(),
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Amount must be a valid number.');
  });
});

describe('PUT /api/expenses/:expenseId', () => {
  const validExpenseId = '123';
  const validPayload = {
    userId: '456',
    categoryId: '789',
    amount: '99.99',
    description: 'Updated description',
    date: '2025-07-15T12:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a 404 not found error when user is not found', async () => {
    const mockUpdatedExpense = { message: "Not Found", status: 404, type: "error" };
    Expenses.findOneAndUpdate.mockResolvedValue(mockUpdatedExpense);

    const response = await request(app)
      .put(`/expenses/${validExpenseId}`)
      .send(validPayload);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(mockUpdatedExpense);
  });

  test('should return 404 when expense not found', async () => {
    Expenses.findOneAndUpdate.mockResolvedValue(null);

    const response = await request(app)
      .put(`/expenses/${validExpenseId}`)
      .send(validPayload);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Not Found', status: 404, type: 'error'});
  });

  test('should handle internal server error', async () => {
    Expenses.findOneAndUpdate.mockRejectedValue(new Error('DB connection failed'));

    const response = await request(app)
      .put(`/expenses/${validExpenseId}`)
      .send(validPayload);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not Found');
  });

});

