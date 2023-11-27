import express from 'express'
import { query } from '../controller/chat.js'

const router = express.Router()

router.post("/", query)

// Inside routes/chat.js in the query route
// router.post("/", (req, res) => {
//     console.log("Request received in chat route");
//     query(req, res);
// });
  

export default router