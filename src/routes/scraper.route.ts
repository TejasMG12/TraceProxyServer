import express, { Router } from 'express';
import { queueKeyword } from 'src/module/scrapper/scrapper.controller';
const router: Router = express.Router();

router.post('/query/:keyword',queueKeyword);

export default router;