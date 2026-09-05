// Utility functions for signature limit API calls

interface LimitCheckResponse {
  canSign: boolean;
  remaining: number;
  system: 'credits';
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

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error checking signature limit');
      } else {
        throw new Error(`Error checking signature limit: ${response.status}`);
      }
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

      if (response.status === 402) {
        throw new Error('Insufficient credits. Please purchase more signatures.');
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error registering signature');
      } else {
        throw new Error(`Error registering signature: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering signature:', error);
    throw error;
  }
}