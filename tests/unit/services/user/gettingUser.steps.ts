import { defineFeature, loadFeature } from 'jest-cucumber';
import {
  getUserWithPetByEmailService,
} from '@/services/userService';
import * as firestore from 'firebase/firestore';

const feature = loadFeature(
  'tests/features/services/user/gettingUser.feature'
);

defineFeature(feature, (test) => {
  let result: { user: any } | null;
  const validExistingEmail = 'user@example.com';
  const validNonExistingEmail = 'non-user@example.com';
  const invalidEmail = 'invalid.email';

  const mockUserData = {
    id: 'u1',
    email: validExistingEmail,
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
      if (requestedEmail === validExistingEmail) {
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
  });

  test(
    'Getting user by valid existing email',
    ({ given, when, then, and }) => {
      given('I have a valid user email', () => {
        // validEmail is already set
      });

      and('the user email exists', () => {
        // existingEmail is already set
      });

      when('I request the user details by email', async () => {
        result = await getUserWithPetByEmailService(validExistingEmail);
      });

      then('I should receive the correct user information', () => {
        expect(result).not.toBeNull();
        expect(result?.user.id).toBe(mockUserData.id);
        expect(result?.user.email).toBe(validExistingEmail);
        expect(result?.user.money).toBe(mockUserData.money);
        expect(result?.user.level).toBe(mockUserData.level);
        expect(result?.user.experience).toBe(mockUserData.experience);
        expect(result?.user.lastLessonConcluded).toBe(mockUserData.lastLessonConcluded);
        expect(result?.user.notifications).toBe(mockUserData.notifications);
        expect(result?.user.pet).toBe(mockUserData.pet);

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
    'Getting user by invalid email format',
    ({ given, when, then }) => {
      given('I have an invalid user email', () => {
        // invalidEmail is already set
      });

      when('I request the user details by email', async () => {
        result = await getUserWithPetByEmailService(invalidEmail);
      });

      then('I should receive a null response', () => {
        expect(result).toBeNull();
      });
    }
  );
});