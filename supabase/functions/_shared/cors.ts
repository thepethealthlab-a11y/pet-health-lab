// Shared CORS configuration for edge functions

const ALLOWED_ORIGINS = [
  'https://thepethealthlab.com',
  'https://www.thepethealthlab.com',
  'http://localhost:5173',
  'http://localhost:3000',
  // Lovable preview URLs
];

export const getCorsHeaders = (origin: string | null) => {
  // Check if origin is an allowed origin or a Lovable preview URL
  const isAllowed = ALLOWED_ORIGINS.includes(origin || '') || 
    (origin && (origin.includes('.lovable.app') || origin.includes('.lovableproject.com')));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

export const handleCorsPrelight = (req: Request): Response | null => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.get('origin');
    return new Response(null, { headers: getCorsHeaders(origin) });
  }
  return null;
};
