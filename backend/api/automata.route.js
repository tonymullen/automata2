import express from 'express';
import AutomataController from './automata.controller.js';

const router = express.Router(); // Get access to Express router

router.route('/').get(AutomataController.apiGetAutomata);
router.route('/id/:id').get(AutomataController.apiGetAutomatonById);
router.route("/idList/:idList").get(AutomataController.apiGetAutomataByIdList);


export default router;
