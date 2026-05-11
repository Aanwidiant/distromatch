export const FORMULAS = {
    // Survey & weights
    surveyAverages: String.raw`
      \begin{aligned}
      v_{\mathrm{ux}}   &= \frac{q_1 + q_2}{2} \\
      v_{\mathrm{perf}} &= \frac{q_3 + q_4}{2} \\
      v_{\mathrm{stab}} &= \frac{q_5 + q_6}{2} \\
      v_{\mathrm{feat}} &= \frac{q_7 + q_8}{2} \\
      v_{\mathrm{supp}} &= \frac{q_9 + q_{10}}{2}
      \end{aligned}
    `,
    surveyTotal: String.raw`
      T = v_{\mathrm{ux}} + v_{\mathrm{perf}} + v_{\mathrm{stab}} + v_{\mathrm{feat}} + v_{\mathrm{supp}}
    `,
    weights: String.raw`
      w_j =
      \begin{cases}
      0, & T = 0 \\
      \dfrac{v_j}{T}, & T \ne 0
      \end{cases}
    `,

    // TOPSIS
    topsisDenominator: String.raw`d_j = \sqrt{\sum_{i=1}^{n} x_{ij}^{2}}`,
    topsisNormalized: String.raw`
      r_{ij} =
      \begin{cases}
      0, & d_j = 0 \\
      \dfrac{x_{ij}}{d_j}, & d_j \ne 0
      \end{cases}
    `,
    topsisWeighted: String.raw`y_{ij} = w_j \cdot r_{ij}`,
    topsisIdeals: String.raw`
      \begin{aligned}
      a_j^{+} &= \max_i y_{ij} \\
      a_j^{-} &= \min_i y_{ij}
      \end{aligned}
    `,
    topsisDistances: String.raw`
      \begin{aligned}
      D_i^{+} &= \sqrt{\sum_{j=1}^{5} (a_j^{+} - y_{ij})^{2}} \\
      D_i^{-} &= \sqrt{\sum_{j=1}^{5} (y_{ij} - a_j^{-})^{2}}
      \end{aligned}
    `,
    topsisCcScore: String.raw`
      CC_i =
      \begin{cases}
      0, & D_i^{+} + D_i^{-} = 0 \\
      \dfrac{D_i^{-}}{D_i^{+} + D_i^{-}}, & D_i^{+} + D_i^{-} \ne 0
      \end{cases}
    `,

    // Bayesian
    bayesMeanCc: String.raw`\bar{C} = \frac{1}{n}\sum_{i=1}^{n} CC_i`,
    bayesShrinkage: String.raw`s_i = \frac{R_i}{R_i + k}`,
    bayesConfidenceAdjusted: String.raw`
      CA_i =
      \begin{cases}
      CC_i, & R_i = 0 \\
      s_i \cdot CC_i + (1 - s_i)\cdot \bar{C}, & R_i > 0
      \end{cases}
    `,

    // Penalty + utility
    prefRaw: String.raw`
      \begin{aligned}
      p &= \operatorname{mapScoreToPreferenceRaw}(v_{\mathrm{lvl}}) \\
        &= \frac{v_{\mathrm{lvl}} - 1}{2} + 1
      \end{aligned}
    `,
    symmetricDistance: String.raw`\Delta_i = \left|t_i - p\right|`,
    distanceNorm: String.raw`\Delta_{i,\mathrm{norm}} = \frac{\Delta_i}{2}`,
    penalty: String.raw`
      Pen_i =
      \max\left(
      \lambda \cdot (\Delta_{i,\mathrm{norm}})^e,
      -0.99
      \right)
    `,
    utility: String.raw`
      \begin{aligned}
      U_i &=
      \operatorname{clip}_{[0,1]}
      \left(
      CA_i + Pen_i \cdot s
      \right)
      \\[6pt]
      \operatorname{clip}_{[0,1]}(z)
      &=
      \min\left(1,\max(0,z)\right)
      \end{aligned}
    `,

    // Ranking
    orderingRule: String.raw`
      i \prec k \iff
      \left(U_i > U_k\right)
      \;\lor\;
      \left(\left|U_i-U_k\right|\le\varepsilon \ \land\ R_i>R_k\right)
    `,
    denseRank: String.raw`
      \begin{aligned}
      &\text{Example result sorting: } \pi(1),\dots,\pi(n).\\
      &\operatorname{rank}(\pi(1)) = 1,\\
      &\operatorname{rank}(\pi(t))=
      \begin{cases}
      \operatorname{rank}(\pi(t-1)), & \left|U_{\pi(t)}-U_{\pi(t-1)}\right|\le\varepsilon\\
      t, & \text{otherwise}
      \end{cases}
      \end{aligned}
    `,
} as const;
