import { defineFeature, loadFeature } from 'jest-cucumber';
import {
  getUserWithPetByIdService,
} from '@/services/userService';
import * as firestore from 'firebase/firestore';

const feature = loadFeature(
  'tests/features/services/user/getUserWithPetById.feature'
);

defineFeature(feature, (test) => {
  let result: { user: any; pet: any } | null;
  const validEmail = 'user@example.com';
  const invalidEmail = 'no-user@example.com';

  const mockUserData = {
    id: 'u1',
    email: validEmail,
    money: 100,
    level: 1,
    experience: 0,
    lastLessonConcluded: null,
    notifications: [],
    pet: { id: 'p1' },
  };

  beforeEach(() => {
    jest.resetAllMocks();

    (firestore.getDocs as jest.Mock).mockImplementation((q) => {
      const requestedEmail = (q as any)._query.fieldFilters[0].value;
      if (requestedEmail === validEmail) {
        return Promise.resolve({
          empty: false,
          docs: [
            {
              id: mockUserData.id,
              data: () => mockUserData,
            },
          ],
        });
      }
      return Promise.resolve({ empty: true, docs: [] });
    });

    (firestore.getDoc as jest.Mock).mockImplementation((ref) => {
      if ((ref as any).id === mockPetData.id) {
        return Promise.resolve({
          exists: () => true,
          id: mockPetData.id,
          data: () => ({
            name: mockPetData.name,
            color: mockPetData.color,
            type: mockPetData.type,
            purchasedItems: mockPetData.purchasedItems,
            activeItems: mockPetData.activeItems,
            wellBeing: mockPetData.wellBeing,
          }),
        });
      }
      return Promise.resolve({ exists: () => false });
    });
  });

  test(
    'Fetching user with valid existing email',
    ({ given, when, then, and }) => {
      given('I have a valid user ID', () => {
        // validEmail is already set
      });

      when('I request the user details by ID', async () => {
        result = await getUserWithPetByIdService(validEmail);
      });

      then('I should receive the correct user information', () => {
        expect(result).not.toBeNull();
        expect(result?.user.email).toBe(validEmail);
        expect(result?.user.id).toBe(mockUserData.id);
      });

      and('the response should contain all required fields', () => {
        expect(result?.user).toHaveProperty('id');
        expect(result?.user).toHaveProperty('email');
        expect(result?.user).toHaveProperty('money');
        expect(result?.user).toHaveProperty('level');
        expect(result?.user).toHaveProperty('experience');
        expect(result?.user).toHaveProperty('lastLessonConcluded');
        expect(result?.user).toHaveProperty('notifications');
        expect(result?.user).toHaveProperty('pet');
      });
    }
  );

  test(
    'Fetching user by invalid email',
    ({ given, when, then }) => {
      given('I have an invalid user ID', () => {
        // invalidEmail is already set
      });

      when('I request the user details by ID', async () => {
        result = await getUserWithPetByIdService(invalidEmail);
      });

      then('I should receive a null response', () => {
        expect(result).toBeNull();
      });
    }
  );
});