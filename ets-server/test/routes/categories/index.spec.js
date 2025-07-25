const
    app          = require('../../../src/app'),
    request      = require('supertest'),
    Categories   = require('../../../src/models/category'),
    mongoose     = require('mongoose')
;

jest.mock('../../../src/models/category');


/**
 * 
 * Test suite for the categories index route
 * 
 * @group api/categories
 * @group api/categories/get
 */
describe('GET /api/categories', () => {

    // clean up the database before each test
    beforeEach(() => { jest.clearAllMocks(); });

    afterEach(() => { jest.resetAllMocks();});

    test('should respond with 200 and mapped category object when categories exist', async () => {
        // Arrange: mock Categories.find to return an array
        const mockCategory = [{ 
            name: 'Test Category',
            slug: 'test-category',
            categoryId: 1,
            description: 'This is a test category'
        }];

        Categories.find.mockResolvedValue(mockCategory);

        // Act
        const res = await request(app).get('/api/categories');

        // Assert
        expect(res.status).toBe(200);

        expect(res.body).toEqual(mockCategory);

        expect(Categories.find).toHaveBeenCalledWith({});
    });

    test('should respond with 404 when no categories found', async () => {
        // Arrange: mock Categories.find to return null (or [])
        Categories.find.mockResolvedValue(undefined);

        // Act
        const res = await request(app).get('/api/categories');

        // Assert
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            status:     404,
            type:       "error",
            detail:     undefined,
            message:    'invalid, categories not found!'
        });
    });

    test('should respond with 500 when Categories.find throws', async () => {
        // Arrange: mock Categories.find to throw
        Categories.find.mockRejectedValue(new Error('DB is down'));

        // Act
        const res = await request(app).get('/api/categories');

        // Assert
        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            type:       'error',
            status:     500,
            message:    'Internal server error',
        });
    });
});

/**
 * Test suite for the get-user-categories route
 * @group api/categories
 * @group api/categories?userId
 */
describe('GET /api/categories?userId', () => {
    
    beforeEach(() => { jest.clearAllMocks(); });

    afterEach(() => { jest.resetAllMocks();});

    test('400 if userId is missing', async () => {
        const res = await request(app)
            .get('/api/categories?');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            type:       "error",
            status:     404,
            message:    "invalid, categories not found!",
        });
    });

    test('400 if userId is not an integer', async () => {
        const res = await request(app)
            .get('/api/categories?userId=NaN');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            type:       "error",
            status:     404,
            detail:     undefined,
            message:    'invalid, categories not found!'
        });
    });

    test('200 and JSON array when categories exist', async () => {
        const fakeCats = [{ categoryId: 1, name: 'Food' }, { categoryId: 2, name: 'drink' }];
        Categories.find.mockResolvedValue(fakeCats);

        const res = await request(app)
            .get('/api/categories?userId=1');

        expect(Categories.find).toHaveBeenCalledWith({});
        expect(res.status).toBe(200);
        expect(res.body).toEqual(fakeCats);
    });
});

/**
 * Test suite for the add-category route
 * @group api/categories
 * @group api/categories/add-category
 */
describe('POST /api/categories/add-category', () => {

    beforeEach(() => { jest.clearAllMocks(); });

    afterEach(() => { jest.resetAllMocks();});

    test('400 if any required field is missing', async () => {
        const res = await request(app)
        .post('/api/categories/add-category')
        .send({ userId: '1', name: 'Food', slug: 'food' }); // missing description

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            type:       "error",
            status:     400,
            detail:     undefined,
            message:    'Missing required fields: userId, name, description or slug.',
        });
    });

    test('400 if userId is not an integer', async () => {
        const res = await request(app)
        .post('/api/categories/add-category')
        .send({
            userId: 'abc',
            name: 'Travel',
            slug: 'travel',
            description: 'Expenses for travel',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            type:       "error",
            status:     400,
            detail:     undefined,
            message:    'An invalid userId was given.',
        });
    });

    test('201 and JSON body when category is successfully saved', async () => {
        
        const mockSave = jest.fn();

        // Any new Categories(...) will return an object with save()
        Categories.mockImplementation(function (data) {
            Object.assign(this, data);
            this.save = mockSave;
        });

        const fakeSaved = {
            userId: 5,
            name: 'Utilities',
            slug: 'utilities',
            categoryId: 123,
            description: 'Monthly bills',
            dateCreated: new Date('july 25, 2025'),
            _id: '507f1f77bcf86cd799439011',
        };

        mockSave.mockResolvedValue(fakeSaved);

        const res = await request(app)
        .post('/api/categories/add-category')
        .send({
            userId: '5',
            name: 'Utilities',
            slug: 'utilities',
            description: 'Monthly bills',
        });

        // Ensure constructor was called with userId parsed to int and dateCreated set
        expect(Categories).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: 5,
                name: 'Utilities',
                slug: 'utilities',
                description: 'Monthly bills',
                dateCreated: expect.any(Date),
            })
        );

        expect(Categories).toHaveBeenCalled();
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            ...fakeSaved,
            dateCreated: fakeSaved.dateCreated.toISOString()
        });
    });
});

/**
 * Test suite for the update-category route
 * @group api/categories
 * @group api/categories/:categoryId
 */
describe('PUT /api/categories/:categoryId', () => {

    beforeEach(() => { 
        jest.clearAllMocks();
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2025-07-25T05:00:00.000Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.resetAllMocks();
    });

    test('400 if categoryId URL param is not a number', async () => {
        const res = await request(app)
        .put('/api/categories/xyz')
        .send({
            userId: '1',
            name: 'Food',
            slug: 'food',
            description: 'All food expenses'
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            type:       "error",
            status:     400,
            detail:     undefined,
            message:    'An invalid category id in url.'
        });
    });

    test('400 if any required field in body is missing', async () => {
        const res = await request(app)
        .put('/ap/categories/10')
        .send({
            userId: '1',
            name: 'Utilities',
            slug: 'utilities'
            // description missing
        });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            type:       "error",
            status:     404,
            detail:     undefined,
            message:    'Not Found',
        });
    });

    test('200 and updated category on success', async () => {
        const fakeUpdated = {
        categoryId: 5,
        userId: 2,
        name: 'Travel',
        slug: 'travel',
        description: 'Travel expenses',
        dateCreated: '2025-01-01T00:00:00.000Z'
        };
        Categories.findOneAndUpdate = jest.fn().mockResolvedValue(fakeUpdated);

        const res = await request(app)
        .put('/api/categories/5')
        .send({
            userId: '2',
            name: 'Travel',
            slug: 'travel',
            description: 'Travel expenses'
        });

        // Ensure findOneAndUpdate was called correctly
        expect(Categories.findOneAndUpdate).toHaveBeenCalledWith(
        { categoryId: 5 },
        { $set: { name: 'Travel', slug: 'travel', description: 'Travel expenses' } },
        { new: true, runValidators: true }
        );

        expect(res.status).toBe(200);
        expect(res.body).toEqual(fakeUpdated);
    });
});

/**
 * Test suite for the delete-category route
 * @group api/categories
 * @group api/categories/:categoryId
 */
describe('DELETE /api/categories/:categoryId', () => {

    beforeEach(() => { jest.clearAllMocks(); });

    afterEach(() => { jest.resetAllMocks();});

    test('should respond 200 and confirmation message on successful delete', async () => {
        const res = await request(app).delete('/api/categories/7');

        expect(Categories.deleteOne).toHaveBeenCalledWith({ categoryId: '7' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: 'Category deleted successfully',
            id: '7'
        });
    });

    test('should respond 500 if deleteOne throws an error', async () => {
        Categories.deleteOne.mockRejectedValue(new Error('DB failure'));

        const res = await request(app).delete('/api/categories/5');

        expect(Categories.deleteOne).toHaveBeenCalledWith({ categoryId: '5' });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            type:       "error",
            message:    'DB failure'
        });
    });

    test('should return the raw param as id even if non‑numeric', async () => {
        const res = await request(app).delete('/api/categories/abc-123');

        expect(Categories.deleteOne).toHaveBeenCalledWith({ categoryId: 'abc-123' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: 'Category deleted successfully',
            id: 'abc-123'
        });
    });
});


afterAll(async () => {
    await mongoose.connection.close();
});