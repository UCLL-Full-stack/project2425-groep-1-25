import categoryService from '../../service/category.service';
import categoryDb from '../../repository/category.db';
import { Category } from '../../model/category';

jest.mock('../../repository/category.db');

let mockCategoryDbAddCategory: jest.Mock;
let mockCategoryDbGetCategories: jest.Mock;

beforeEach(() => {
    mockCategoryDbAddCategory = categoryDb.addCategory as jest.Mock;
    mockCategoryDbGetCategories = categoryDb.getCategories as jest.Mock;
});

afterEach(() => {
    jest.clearAllMocks();
});

const categoryInput = { name: 'Concert', description: 'Concert of artist' };
const category = new Category({ id: 1, ...categoryInput });

test('Given a valid category, when adding new category, then category is created.', async () => {
    mockCategoryDbAddCategory.mockResolvedValue(category);

    const result = await categoryService.addCategory(categoryInput);

    expect(mockCategoryDbAddCategory).toHaveBeenCalledTimes(1);
    expect(mockCategoryDbAddCategory).toHaveBeenCalledWith(expect.any(Category));

    expect(result.getId()).toBe(1);
    expect(result.getName()).toBe(categoryInput.name);
    expect(result.getDescription()).toBe(categoryInput.description);
});

test('When getting all categories, then all categories are returned.', async () => {
    const categories = [category];
    mockCategoryDbGetCategories.mockResolvedValue(categories);

    const result = await categoryService.getCategories();

    expect(mockCategoryDbGetCategories).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
});