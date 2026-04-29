import { Hono } from 'hono';
import { runDssPipelineTest } from '../handlers';
import { protect } from '../middlewares';

const dss = new Hono();

dss.post('/', protect, runDssPipelineTest);

export default dss;
