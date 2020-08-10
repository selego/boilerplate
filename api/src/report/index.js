const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const pdf = require("html-pdf");
const passport = require("passport");

const WorkshopObject = require("../models/workshop");

const options = { format: "A4", orientation: "landscape", margin: 0, base: "https://api.datadvise.com/" };

router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    let html = fs.readFileSync(path.resolve(__dirname, "./report.html"), "utf8");

    const workshops = await WorkshopObject.find({ user_id: req.user._id });

    function getAnswer(workshop, answer) {
      const w = workshops.find((e) => e.key === workshop);
      if (!w || !w.answers[answer]) return "";

      if (Array.isArray(w.answers[answer])) {
        return w.answers[answer].join("<br/>");
      }
      return w.answers[answer];
    }

    html = html.replace(/{{customer_segments}}/g, getAnswer("customersegment", "customer_segments"));
    html = html.replace(/{{early_adopter}}/g, getAnswer("earlyadopters", "early_adopters"));
    html = html.replace(/{{channels}}/g, getAnswer("channels", "customer_segments"));
    html = html.replace(/{{unfair_advantage}}/g, getAnswer("unfairadvantage", "customer_segments"));
    html = html.replace(/{{unique_value_proposition}}/g, getAnswer("uniquevalueproposition", "uniquevalueproposition"));
    html = html.replace(/{{high_level_concept}}/g, getAnswer("highlevelconcept", "highlevelconcept"));
    html = html.replace(/{{keymetrics}}/g, getAnswer("keymetrics", "customer_segments"));
    html = html.replace(/{{solution}}/g, getAnswer("solution", "solutions"));
    html = html.replace(/{{problems}}/g, getAnswer("problem", "problems"));
    html = html.replace(/{{existing_alternatives}}/g, getAnswer("existingalternatives", "existing_alternatives"));
    html = html.replace(/{{cost_structure}}/g, getAnswer("coststructure", "customer_segments"));
    html = html.replace(/{{revenue_streams}}/g, getAnswer("revenuestreams", "customer_segments"));

    // res.send(html);
    pdf.create(html, options).toBuffer(function (err, buffer) {
      res.contentType("application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="canvas.pdf"');
      res.send(buffer);
    });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
