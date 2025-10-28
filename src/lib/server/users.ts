import { getDatabase } from './database.js';
import type { User } from './database.js';
import bcrypt from 'bcrypt';

export class UserService {
  private static saltRounds = 12;

  private static get db() {
    return getDatabase();
  }

  /**
   * Authenticate user with email and password
   */
  static async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const user = this.getUserByEmail(email);
      if (!user || !user.is_active) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return null;
      }

      // Update last login
      this.updateLastLogin(user.id);

      // Return user without password hash
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      // Log error in development only
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      return null;
    }
  }

  /**
   * Get user by email
   */
  static getUserByEmail(email: string): User | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1');
      const user = stmt.get(email) as User | undefined;
      return user || null;
    } catch {
      return null;
    }
  }

  /**
   * Get user by ID
   */
  static getUserById(id: number): User | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ? AND is_active = 1');
      const user = stmt.get(id) as User | undefined;
      return user || null;
    } catch {
      return null;
    }
  }

  /**
   * Create new user
   */
  static async createUser(
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'editor' = 'editor'
  ): Promise<User | null> {
    try {
      // Check if user already exists
      const existingUser = this.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, this.saltRounds);

      // Insert new user
      const stmt = this.db.prepare(`
				INSERT INTO users (email, password_hash, name, role, is_active)
				VALUES (?, ?, ?, ?, ?)
			`);

      const result = stmt.run(email, password_hash, name, role, 1);

      // Get the created user
      return this.getUserById(result.lastInsertRowid as number);
    } catch {
      return null;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    try {
      const password_hash = await bcrypt.hash(newPassword, this.saltRounds);
      const stmt = this.db.prepare(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );
      const result = stmt.run(password_hash, id);
      return result.changes > 0;
    } catch {
      return false;
    }
  }

  /**
   * Update user information (except password)
   */
  static updateUser(
    id: number,
    updates: Partial<Pick<User, 'name' | 'email' | 'role' | 'is_active'>>
  ): boolean {
    try {
      const fields = [];
      const values = [];

      if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.email !== undefined) {
        fields.push('email = ?');
        values.push(updates.email);
      }
      if (updates.role !== undefined) {
        fields.push('role = ?');
        values.push(updates.role);
      }
      if (updates.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(updates.is_active ? 1 : 0);
      }

      if (fields.length === 0) {
        return true; // No updates needed
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const stmt = this.db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
      const result = stmt.run(...values);
      return result.changes > 0;
    } catch {
      return false;
    }
  }

  /**
   * Update last login timestamp
   */
  static updateLastLogin(id: number): boolean {
    try {
      const stmt = this.db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch {
      return false;
    }
  }

  /**
   * Deactivate user (soft delete)
   */
  static deactivateUser(id: number): boolean {
    try {
      const stmt = this.db.prepare(
        'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );
      const result = stmt.run(id);
      return result.changes > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get all users (admin only)
   */
  static getAllUsers(): User[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM users ORDER BY created_at DESC');
      return stmt.all() as User[];
    } catch {
      return [];
    }
  }

  /**
   * Verify password strength
   */
  static verifyPasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character (!@#$%^&*)'
      };
    }
    return { isValid: true };
  }
}
