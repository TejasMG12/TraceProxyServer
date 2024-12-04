// import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from "src/util";
import channel from 'src';

export const queueKeyword = catchAsync(async (req: Request, res: Response) => {
    const keyword = req.params['keyword'];
    if (!keyword) {
        return res.status(400).send({ error: 'Keyword is required' });
    }
    if (channel) {
        await channel.sendToQueue('scrapeQueue', Buffer.from(keyword));
    }
    else {
        throw new Error('No channel found');
    }
    return res.send({ message: `Request for ${keyword} queued.` });
});
