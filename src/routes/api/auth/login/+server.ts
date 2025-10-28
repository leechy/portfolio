import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserService } from '$lib/server/users.js';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Authenticate user
    const authenticatedUser = await UserService.authenticate(email, password);

    if (!authenticatedUser) {
      return json(
        {
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Return user data (without password hash)
    return json({
      success: true,
      user: {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role
      }
    });
  } catch {
    return json(
      {
        success: false,
        error: 'Authentication failed'
      },
      { status: 500 }
    );
  }
};
