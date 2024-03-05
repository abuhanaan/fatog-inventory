import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique reference ID using UUID version 4.
 * @returns {string} A unique reference ID.
 */
export function generateReferenceId(): string {
  // Generate a unique reference ID using UUID version 4
  const referenceId = uuidv4();
  return referenceId;
}
