import AutomataDAO from '../dao/automataDAO.js';

export default class AutomataController {

  static async apiGetAutomata(req, res, next) {
    const automataPerPage = req.query.automataPerPage ?
      parseInt(req.query.automataPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.title) {
      filters.title = req.query.title;
    } else if (req.query.rated) {
      filters.rated = req.query.rated;
    }

    const { automataList, totalNumAutomata } = await
      AutomataDAO.getAutomata({ filters, page, automataPerPage });

    let response = {
      automata: automataList,
      page: page,
      filters: filters,
      entries_per_page: automataPerPage,
      total_results: totalNumAutomata,
    };
    res.json(response);
  }

  static async apiGetAutomatonById(req, res, next) {
    try {
      let id = req.params.id || {};
      let automaton = await AutomataDAO.getAutomatonByID(id);
      if (!automaton) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(automaton);
    } catch(e) {
      console.log(`API, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetAutomataByIdList(req, res, next) {
    try {
      let idList = JSON.parse(req.params.idList) || {}
      let automata = await AutomataDAO.getAutomataByIdList(idList);
      if (!automata) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.json(automata);
    } catch(e) {
      console.log(`API, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiAddAutomaton(req, res, next) {
    try {
      const automaton = req.body;
      const date = new Date();

      const automatonResponse = await AutomataDAO.addAutomaton({
        'created': date,
        ...automaton
      });

      const { error } = automatonResponse;

      if (error ) {
        res.status(500).json({ error: "Unable to create automaton" });
      } else {
        res.json({
          status: "success",
          response: automatonResponse
        });
      }
    } catch(e) {
      res.status(500).json({ error: e });
    }
  }

  static async apiUpdateAutomaton(req, res, next) {
    try {
      const automaton = req.body;
      const date = new Date();
      const automatonResponse = await AutomataDAO.updateAutomaton(
        {
          'updated': date,
          ...automaton
        }
      )
      var { error } = automatonResponse;
      if (error) {
        res.status(500).json({ error: `Unable to update automaton. ${e}` });
      }

      if (automatonResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update automaton - user may not be original creator."
        );
      }
      res.json({
        status: "success",
        response: automatonResponse
       });
    } catch(e) {
      res.status(500).json({ error: e });
    }
  }


  static async apiDeleteAutomaton(req, res, next) {
    try {
      let id = req.params.id || {};
      let automaton = await AutomataDAO.getAutomatonByID(id);
      if (!automaton) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(automaton);
    } catch(e) {
      console.log(`API, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
