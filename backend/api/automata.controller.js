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
    console.log(req.body.automaton);
    try {
      const automaton = req.body.automaton;
      const userInfo = {
        // name: req.body.name,
        _id: req.body.user_id,
      }

      const date = new Date();

      const automatonResponse = await AutomataDAO.addAutomaton(
        userInfo,
        automaton,
        date
      );

      const { error } = reviewResponse;

      if (error ) {
        res.status(500).json({ error: "Unable to create automaton" });
      } else {
        res.json({
          status: "success",
          response: reviewResponse
        });
      }
    } catch(e) {
      res.status(500).json({ error: e });
    }
  }

  static async apiUpdateAutomaton(req, res, next) {
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
