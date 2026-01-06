// Utility functions for signature limit API calls

interface LimitCheckResponse {
  canSign: boolean;
  remaining: number;
  signaturesCount: number;
  maxSignatures: number;
  plan: 'FREE' | 'PREMIUM';
  period: 'week' | 'month';
}

interface RegisterSignatureResponse {
  success: boolean;
  signature: any;
  message: string;
}

/**
 * Check the user's signature limit
 * @returns LimitCheckResponse
 */
export async function checkSignatureLimit(): Promise<LimitCheckResponse> {
  try {
    const response = await fetch('/api/signatures/check-limit');
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('User not authenticated');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error checking signature limit');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking signature limit:', error);
    throw error;
  }
}

/**
 * Register a new signature
 * @param fileName The name of the PDF file that was signed
 * @returns RegisterSignatureResponse
 */
export async function registerSignature(fileName: string): Promise<RegisterSignatureResponse> {
  try {
    const response = await fetch('/api/signatures/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('User not authenticated');
      }
      if (response.status === 403) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signature limit exceeded');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error registering signature');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering signature:', error);
    throw error;
  }
}