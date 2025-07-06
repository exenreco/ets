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
      { _id: '1', userId: 1, amount: 10.5, description: 'Groceries' },
      { _id: '2', userId: 2, amount: 25.0, description: 'Transport' },
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

    expect(res.status).toBe(500); // assuming you have error middleware that returns 500
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

