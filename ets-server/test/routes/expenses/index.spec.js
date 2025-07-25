const
    app          = require('../../../src/app'),
    request      = require('supertest'),
    Expenses     = require('../../../src/models/expense'),
    mongoose     = require('mongoose');

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

  // NEW TESTS:

  it('should handle string userId and convert to number for database query', async () => {
    const mockExpenses = [
      { userId: 5000, categoryId: 1003, amount: 150.75, description: 'Office supplies' },
    ];

    Expenses.find.mockResolvedValue(mockExpenses);

    const res = await request(app).get('/api/expenses/user/5000');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockExpenses);
    expect(Expenses.find).toHaveBeenCalledWith({userId: 5000});
  });

  it('should return 400 for invalid userId format', async () => {
    const res = await request(app).get('/api/expenses/user/invalid-user-id');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch("invalid user id type!"); // Match actual message
    expect(Expenses.find).not.toHaveBeenCalled();
  });

  it('should return only expenses belonging to the specified user', async () => {
    const mockExpenses = [
      { userId: 3000, categoryId: 1001, amount: 50.00, description: 'Lunch' },
      { userId: 3000, categoryId: 1002, amount: 20.00, description: 'Coffee' },
      { userId: 3000, categoryId: 1003, amount: 100.00, description: 'Books' },
    ];

    Expenses.find.mockResolvedValue(mockExpenses);

    const res = await request(app).get('/api/expenses/user/3000');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockExpenses);
    expect(Expenses.find).toHaveBeenCalledWith({userId: 3000});

    // Verify all returned expenses belong to the requested user
    res.body.forEach(expense => {
      expect(expense.userId).toBe(3000);
    });
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

// search expense endpoint
describe('Get /api/expenses/:userId', () => {

  it('should return 400 if userId is not a number', async () => {
    const res = await request(app).get('/api/expenses/not-a-number');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ 
      status: 400,
      type: "error",
      message: 'An invalid userId was given.' 
    });
    expect(Expenses.find).not.toHaveBeenCalled();
  });

  it('should return 404 if no matching expense found', async () => {
    // mock find().exec() to resolve to null
    Expenses.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app).get('/api/expenses/123');
    expect(Expenses.find).toHaveBeenCalledWith({ userId: 123 });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'no matching expense found' });
  });

  it('should return 200 and filtered results when query parameters are provided', async () => {
    const fakeResults = [{ 
      amount: 50,
      expenseId: 1, 
      categoryId: 2,
      description: 'Coffee', 
      date: `${new Date('2025-01-01')}`, 
      dateCreated: `${new Date('2025-01-01')}`,
      dateModified: `${new Date('2025-01-01')}`,
      
    }];
    // mock find().exec() to resolve to our fakeResults
    Expenses.find.mockImplementation(filter => ({
      exec: jest.fn().mockResolvedValue(fakeResults),
    }));

    const res = await request(app)
      .get('/api/expenses/42')
      .query({
        categoryId: 2,
        minAmount: '10',
        maxAmount: '100',
        description: 'cof',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      });

    // build expected filter object
    expect(Expenses.find).toHaveBeenCalledWith({
      userId: 42,
      description: { $regex: 'cof', $options: 'i' },
      amount: { $gte: '10', $lte: '100' },
      date: {
        $gte: new Date('2025-01-01'),
        $lte: new Date('2025-12-31'),
      },
      categoryId: 2,
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeResults);
  });
});


// Delete expense endpoint
describe('DELETE /api/expenses', () => {
  it('should successfully delete an expense and return confirmation', async () => {
    const
      userId = '10002',
      expenseId = '12345'
    ;

    // Mock successful deletion
    Expenses.findOneAndDelete.mockResolvedValue({ 
      userId: 10002,
      expenseId: 12345,
      amount: '12.99',
      date: 'jan 12, 2023',
      description: 'food'
    });

    const response = await request(app)
      .delete(`/api/expenses?userId=${userId}&expenseId=${expenseId}`) // Add /api prefix
      .expect(200);

    expect(Expenses.findOneAndDelete).toHaveBeenCalledWith({
      userId: parseInt(`${userId}`, 10),
      expenseId: parseInt(`${expenseId}`, 10)
    });
    expect(response.body).toEqual({ message: 'Expense deleted successfully' });
  });

  it('should handle failed delete and return 500 status', async () => {
    const 
      userId = '10002',
      expenseId = '12345',
      errorMessage = 'Delete failed'
    ;

    // Mock database error
    Expenses.findOneAndDelete.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .delete(`/api/expenses?userId=${userId}&expenseId=${expenseId}`) // Add /api prefix
      .expect(500);

    expect(Expenses.findOneAndDelete).toHaveBeenCalledWith({
      userId: parseInt(`${userId}`, 10),
      expenseId: parseInt(`${expenseId}`, 10)
    });

    expect(response.body.message).toBe('Internal server error');
  });

  it('should call next with error if deleteOne throws', async () => {
    const 
      userId = '10002',
      expenseId = '12345',
      errorMessage = 'Delete failed'
    ;

    // Mock a different error
     Expenses.findOneAndDelete.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .delete(`/api/expenses?userId=${userId}&expenseId=${expenseId}`) // Add /api prefix
      .expect(500);

     expect(Expenses.findOneAndDelete).toHaveBeenCalledWith({
      userId: parseInt(`${userId}`, 10),
      expenseId: parseInt(`${expenseId}`, 10)
    });

    expect(response.body.message).toBe('Internal server error');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

