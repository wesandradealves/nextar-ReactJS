// import type { NextApiRequest, NextApiResponse } from 'next';

// // eslint-disable-next-line @typescript-eslint/no-require-imports
// const translate = require('translate-google');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { text, to } = req.query;
//   if (!text || !to) return res.status(400).json({ error: 'Missing params' });

//   try {
//     const result = await translate(String(text), { to: String(to) });
//     res.status(200).json({ translated: result });
//   } catch (e) {
//     res.status(500).json({ error: (e as Error).message });
//   }
// }
