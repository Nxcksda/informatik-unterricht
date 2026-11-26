// ---------- Aufgaben ----------
      const binToDec = ["1011", "110101", "10011100"];
      const binToHex = ["11010110", "11110010", "101001111100"];
      const hexToBin = ["3F", "B5", "2C9"];

      const HEX = "0123456789ABCDEF";

      function input(answer, type, placeholder) {
        return `<input class="ans" data-answer="${answer}" data-type="${type}" placeholder="${placeholder || ""}" autocomplete="off">`;
      }

      // ---------- Teil 1 ----------
      document.getElementById("part1").innerHTML = binToDec
        .map((bin, i) => {
          const n = bin.length;
          const bits = bin.split("");
          const place = bits.map((_, k) => 2 ** (n - 1 - k));
          const total = parseInt(bin, 2);
          return `
      <div class="task">
        <h3><span>Aufgabe 1.${i + 1}: &nbsp;<code>${bin}<sub>2</sub></code> = ?<sub>10</sub></span><span class="badge"></span></h3>
        <p class="hint">Trage die Stellenwerte und die Werte (Bit × Stellenwert) ein.</p>
        <div class="table-wrap"><table class="work">
          <tr><th>Stellenwert</th>${place.map((p) => `<td>${input(p, "dec")}</td>`).join("")}</tr>
          <tr><th>Bit</th>${bits.map((b) => `<td class="given">${b}</td>`).join("")}</tr>
          <tr><th>Bit × Stellenwert</th>${bits.map((b, k) => `<td>${input(b * place[k], "dec")}</td>`).join("")}</tr>
        </table></div>
        <div class="result-row">Dezimalzahl (Summe) = ${input(total, "dec")}</div>
      </div>`;
        })
        .join("");

      // ---------- Teil 2 ----------
      function nibbles(bin) {
        const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
        return padded.match(/.{4}/g);
      }
      document.getElementById("part2").innerHTML = binToHex
        .map((bin, i) => {
          const groups = nibbles(bin);
          const result = parseInt(bin, 2).toString(16).toUpperCase();
          return `
      <div class="task">
        <h3><span>Aufgabe 2.${i + 1}: &nbsp;<code>${groups.join(" ")}<sub>2</sub></code> = ?<sub>16</sub></span><span class="badge"></span></h3>
        <p class="hint">Die Zahl ist schon in 4er-Gruppen aufgeteilt.</p>
        <div class="table-wrap"><table class="work">
          <tr><th>4er-Gruppe</th>${groups.map((g) => `<td class="given">${g}</td>`).join("")}</tr>
          <tr><th>Dezimalwert</th>${groups.map((g) => `<td>${input(parseInt(g, 2), "dec")}</td>`).join("")}</tr>
          <tr><th>Hex-Ziffer</th>${groups.map((g) => `<td>${input(HEX[parseInt(g, 2)], "hex")}</td>`).join("")}</tr>
        </table></div>
        <div class="result-row">Hexadezimalzahl = ${input(result, "hex")}</div>
      </div>`;
        })
        .join("");

      // ---------- Teil 3 ----------
      document.getElementById("part3").innerHTML = hexToBin
        .map((hex, i) => {
          const digits = hex.split("");
          const result = digits
            .map((d) => HEX.indexOf(d).toString(2).padStart(4, "0"))
            .join("");
          return `
      <div class="task">
        <h3><span>Aufgabe 3.${i + 1}: &nbsp;<code>${hex}<sub>16</sub></code> = ?<sub>2</sub></span><span class="badge"></span></h3>
        <p class="hint">Jede Hex-Ziffer wird zu genau 4 Bits.</p>
        <div class="table-wrap"><table class="work">
          <tr><th>Hex-Ziffer</th>${digits.map((d) => `<td class="given">${d}</td>`).join("")}</tr>
          <tr><th>Dezimalwert</th>${digits.map((d) => `<td>${input(HEX.indexOf(d), "dec")}</td>`).join("")}</tr>
          <tr><th>Binär (4 Stellen)</th>${digits.map((d) => `<td>${input(HEX.indexOf(d).toString(2).padStart(4, "0"), "nib", "____")}</td>`).join("")}</tr>
        </table></div>
        <div class="result-row">Binärzahl = ${input(result, "bin", "z. B. 0101 1100")}</div>
      </div>`;
        })
        .join("");

      // ---------- Prüfen ----------
      function stripZeros(s) {
        return s.replace(/^0+(?=.)/, "");
      }

      function isCorrect(value, answer, type) {
        const v = value.replace(/\s+/g, "").toUpperCase();
        if (v === "") return false;
        switch (type) {
          case "dec":
            return /^\d+$/.test(v) && Number(v) === Number(answer);
          case "hex":
            return (
              /^[0-9A-F]+$/.test(v) && stripZeros(v) === stripZeros(answer)
            );
          case "nib":
            return v === answer; // genau 4 Stellen
          case "bin":
            return /^[01]+$/.test(v) && stripZeros(v) === stripZeros(answer);
        }
        return false;
      }

      function checkAll() {
        let ok = 0,
          total = 0,
          tasksOk = 0;
        const tasks = document.querySelectorAll(".task");
        tasks.forEach((task) => {
          let tOk = 0,
            tTotal = 0;
          task.querySelectorAll("input.ans").forEach((inp) => {
            const right = isCorrect(
              inp.value,
              inp.dataset.answer,
              inp.dataset.type,
            );
            inp.classList.toggle("ok", right);
            inp.classList.toggle("bad", !right);
            tTotal++;
            if (right) tOk++;
          });
          ok += tOk;
          total += tTotal;
          const badge = task.querySelector(".badge");
          badge.textContent = `${tOk} / ${tTotal} richtig`;
          badge.className = "badge " + (tOk === tTotal ? "ok" : "bad");
          task.classList.toggle("all-ok", tOk === tTotal);
          if (tOk === tTotal) tasksOk++;
        });

        const pct = Math.round((ok / total) * 100);
        const name = document.getElementById("name").value.trim();
        let msg =
          pct === 100
            ? "🎉 Perfekt! Alles richtig!"
            : pct >= 75
              ? "👍 Sehr gut – schau dir die roten Felder nochmal an."
              : pct >= 50
                ? "🙂 Guter Anfang! Öffne bei Bedarf die Erklärungen."
                : "💪 Nicht aufgeben – lies dir die Erklärungen durch und versuch es nochmal.";
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
        document.querySelectorAll("input.ans").forEach((inp) => {
          inp.value = "";
          inp.classList.remove("ok", "bad");
        });
        document.querySelectorAll(".badge").forEach((b) => {
          b.textContent = "";
          b.className = "badge";
        });
        document
          .querySelectorAll(".task")
          .forEach((t) => t.classList.remove("all-ok"));
        document.getElementById("summary").style.display = "none";
      }

      function escapeHtml(s) {
        return s.replace(
          /[&<>"']/g,
          (c) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            })[c],
        );
      }
