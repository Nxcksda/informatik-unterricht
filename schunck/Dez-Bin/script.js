  // ---------- Aufgaben ----------
  const numbers = [19, 37, 90];

  function input(answer, type, placeholder) {
    return `<input class="ans" data-answer="${answer}" data-type="${type}" placeholder="${placeholder || ""}" autocomplete="off">`;
  }

  document.getElementById("tasks").innerHTML = numbers.map((n, i) => {
    const rows = [];
    let x = n;
    do { rows.push({ x, q: Math.floor(x / 2), r: x % 2 }); x = Math.floor(x / 2); } while (x > 0);
    const result = n.toString(2);

    const body = rows.map((row, k) => `
      <tr>
        ${k === 0 ? `<td class="given">${row.x}</td>` : `<td>${input(row.x, "dec")}</td>`}
        <td>${input(row.q, "dec")}</td>
        <td class="rest-col">${input(row.r, "dec")}</td>
        ${k === 0 ? `<td class="arrow" rowspan="${rows.length}" title="von unten nach oben lesen">↑</td>` : ""}
      </tr>`).join("");

    return `
      <div class="task">
        <h3><span>Aufgabe ${i + 1}: &nbsp;<code>${n}<sub>10</sub></code> = ?<sub>2</sub></span><span class="badge"></span></h3>
        <p class="hint">Fülle die Tabelle Zeile für Zeile aus, bis das Ergebnis 0 ist.</p>
        <div class="table-wrap"><table class="work">
          <tr><th>Zahl</th><th>: 2 =</th><th>Rest</th><th></th></tr>
          ${body}
        </table></div>
        <div class="result-row">Binärzahl (Reste von unten nach oben) = ${input(result, "bin", "z. B. 1101")}</div>
      </div>`;
  }).join("");

  // ---------- Prüfen ----------
  function isCorrect(value, answer, type) {
    const v = value.replace(/\s+/g, "");
    if (v === "") return false;
    if (type === "dec") return /^\d+$/.test(v) && Number(v) === Number(answer);
    if (type === "bin") return /^[01]+$/.test(v) && v.replace(/^0+(?=.)/, "") === answer;
    return false;
  }

  function checkAll() {
    let ok = 0, total = 0, tasksOk = 0;
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(task => {
      let tOk = 0, tTotal = 0;
      task.querySelectorAll("input.ans").forEach(inp => {
        const right = isCorrect(inp.value, inp.dataset.answer, inp.dataset.type);
        inp.classList.toggle("ok", right);
        inp.classList.toggle("bad", !right);
        tTotal++; if (right) tOk++;
      });
      ok += tOk; total += tTotal;
      const badge = task.querySelector(".badge");
      badge.textContent = `${tOk} / ${tTotal} richtig`;
      badge.className = "badge " + (tOk === tTotal ? "ok" : "bad");
      task.classList.toggle("all-ok", tOk === tTotal);
      if (tOk === tTotal) tasksOk++;
    });

    const pct = Math.round(ok / total * 100);
    const name = document.getElementById("name").value.trim();
    const msg = pct === 100 ? "🎉 Perfekt! Alles richtig!" :
                pct >= 75  ? "👍 Sehr gut – schau dir die roten Felder nochmal an." :
                pct >= 50  ? "🙂 Guter Anfang! Öffne bei Bedarf die Erklärung." :
                             "💪 Nicht aufgeben – lies dir die Erklärung durch und versuch es nochmal.";
    const s = document.getElementById("summary");
    s.style.display = "block";
    s.innerHTML = `${name ? `<div>${escapeHtml(name)}</div>` : ""}
      <div class="big">${ok} von ${total} Feldern richtig (${pct} %)</div>
      <div>${tasksOk} von ${tasks.length} Aufgaben komplett gelöst</div>
      <div style="margin-top:8px">${msg}</div>`;
    s.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function resetAll() {
    if (!confirm("Wirklich alle Eingaben löschen?")) return;
    document.querySelectorAll("input.ans").forEach(inp => { inp.value = ""; inp.classList.remove("ok", "bad"); });
    document.querySelectorAll(".badge").forEach(b => { b.textContent = ""; b.className = "badge"; });
    document.querySelectorAll(".task").forEach(t => t.classList.remove("all-ok"));
    document.getElementById("summary").style.display = "none";
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
