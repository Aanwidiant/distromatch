import { Hono } from 'hono';
import {
    getBayesianCalc,
    getDenominatorData,
    getDistroMatrix,
    getDssRunList,
    getDssRunMeta,
    getDssRunRecommendations,
    getIdealSolution,
    getNormalizeData,
    getPenaltyCalc,
    getSurveyData,
    getTopsisCalc,
    getWeightedData,
    handleDeleteDssRun,
    runDssPipelineTest,
} from '../handlers';
import { protect } from '../middlewares';

const dss = new Hono();

dss.post('/', protect, runDssPipelineTest);
dss.get('/list/:username', protect, getDssRunList);
dss.get('/distro', getDistroMatrix);
dss.get('/:id/meta/:username', getDssRunMeta);
dss.get('/:id/recommendations', getDssRunRecommendations);
dss.get('/:id/survey', getSurveyData);
dss.get('/:id/denominator', getDenominatorData);
dss.get('/:id/normalize', getNormalizeData);
dss.get('/:id/weighted', getWeightedData);
dss.get('/:id/ideal', getIdealSolution);
dss.get('/:id/topsis', getTopsisCalc);
dss.get('/:id/bayesian', getBayesianCalc);
dss.get('/:id/penalty', getPenaltyCalc);
dss.delete('/:id', protect, handleDeleteDssRun);

export default dss;
