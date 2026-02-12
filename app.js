/**
 * Gamertag Generator - Main Application Logic
 * Handles search, filtering, generation, and copy-to-clipboard.
 */

(function () {
  "use strict";

  // ===== Constants =====
  var RESULT_COUNT = 8;
  var COPY_FEEDBACK_MS = 1500;
  var STYLE_LABELS = {
    dark: "Dark",
    power: "Power",
    scifi: "Sci-Fi",
    fantasy: "Fantasy",
    humor: "Humor",
    legend: "Legend",
    custom: "Custom",
  };

  // ===== State =====
  var selectedStyles = {};
  var selectedGender = "all";

  // ===== DOM Refs =====
  var searchInput = document.getElementById("searchInput");
  var matchHint = document.getElementById("matchHint");
  var styleTagsEl = document.getElementById("styleTags");
  var genderTagsEl = document.getElementById("genderTags");
  var generateBtn = document.getElementById("generateBtn");
  var resultsGrid = document.getElementById("resultsGrid");
  var resultCount = document.getElementById("resultCount");

  // ===== Filtering =====
  function getFilteredWords(wordList) {
    var query = searchInput.value.trim().toLowerCase();
    var hasStyleFilter = Object.keys(selectedStyles).length > 0;

    return wordList.filter(function (item) {
      var matchStyle = !hasStyleFilter || selectedStyles[item.style];
      var matchGender =
        selectedGender === "all" ||
        item.gender === selectedGender ||
        item.gender === "neutral";
      var matchSearch = !query || item.word.toLowerCase().indexOf(query) !== -1;
      return matchStyle && matchGender && matchSearch;
    });
  }

  function updateMatchHint() {
    var query = searchInput.value.trim();
    if (!query) {
      matchHint.textContent = "";
      return;
    }
    var total =
      getFilteredWords(adjectives).length + getFilteredWords(nouns).length;
    if (total > 0) {
      matchHint.textContent = total + " words matched";
    } else {
      matchHint.textContent = "";
    }
  }

  // ===== Style Tag Toggle =====
  styleTagsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".tag--style");
    if (!btn) return;
    var style = btn.dataset.style;
    if (selectedStyles[style]) {
      delete selectedStyles[style];
      btn.setAttribute("aria-pressed", "false");
    } else {
      selectedStyles[style] = true;
      btn.setAttribute("aria-pressed", "true");
    }
    updateMatchHint();
  });

  // ===== Gender Toggle =====
  genderTagsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".tag--gender");
    if (!btn) return;
    var buttons = genderTagsEl.querySelectorAll(".tag--gender");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("tag--active");
      buttons[i].setAttribute("aria-checked", "false");
    }
    btn.classList.add("tag--active");
    btn.setAttribute("aria-checked", "true");
    selectedGender = btn.dataset.gender;
    updateMatchHint();
  });

  // ===== Search Input =====
  searchInput.addEventListener("input", updateMatchHint);

  // ===== Tag Stylization =====
  // Randomly apply different name formats for variety
  var SEPARATORS = ["", "_", ".", "-"];
  var LEET_MAP = { a: "4", e: "3", i: "1", o: "0", s: "5", t: "7" };

  function stylizeTag(word1, word2) {
    var style = Math.floor(Math.random() * 10);

    switch (style) {
      case 0: // PascalCase + number: ShadowKing42
        return word1 + word2 + randNum(2);
      case 1: // PascalCase no number: ShadowKing
        return word1 + word2;
      case 2: // With separator: Shadow_King
        return word1 + pickRandom(SEPARATORS) + word2;
      case 3: // Separator + number: Shadow_King99
        return word1 + pickRandom(SEPARATORS) + word2 + randNum(2);
      case 4: // Leet speak: Sh4d0wKing
        return leetSpeak(word1) + word2;
      case 5: // Leet speak both: Sh4d0wK1ng
        return leetSpeak(word1) + leetSpeak(word2);
      case 6: // camelCase: shadowKing
        return word1.toLowerCase() + word2;
      case 7: // Number in middle: Shadow42King
        return word1 + randNum(2) + word2;
      case 8: // Lowercase prefix + PascalCase: xShadowKing
        var prefixes = ["x", "ii", "el", "da", "lil", "mr", "ms"];
        return pickRandom(prefixes) + word1 + word2;
      case 9: // Add z/x suffix: ShadowKingz
        var suffixes = ["z", "x", "o", "ii", "zz"];
        return word1 + word2 + pickRandom(suffixes);
      default:
        return word1 + word2;
    }
  }

  function leetSpeak(word) {
    var result = "";
    var swapped = false;
    for (var i = 0; i < word.length; i++) {
      var ch = word[i];
      var lower = ch.toLowerCase();
      // Only replace some letters randomly for a natural look
      if (LEET_MAP[lower] && !swapped && Math.random() < 0.5) {
        result += LEET_MAP[lower];
        swapped = true;
      } else {
        result += ch;
      }
    }
    return result;
  }

  function randNum(digits) {
    if (Math.random() < 0.3) return ""; // 30% chance no number at all
    var d = Math.random() < 0.5 ? 2 : 3;
    var max = Math.pow(10, d);
    return String(Math.floor(Math.random() * max));
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ===== Generate =====
  generateBtn.addEventListener("click", generate);

  function generate() {
    var query = searchInput.value.trim();
    var filtAdj = getFilteredWords(adjectives);
    var filtNoun = getFilteredWords(nouns);

    // If search query has no matches, force user word into every result
    if (query && filtAdj.length === 0 && filtNoun.length === 0) {
      var capitalized =
        query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
      var hasStyleFilter = Object.keys(selectedStyles).length > 0;

      var poolAdj = adjectives.filter(function (item) {
        var ms = !hasStyleFilter || selectedStyles[item.style];
        var mg =
          selectedGender === "all" ||
          item.gender === selectedGender ||
          item.gender === "neutral";
        return ms && mg;
      });
      var poolNoun = nouns.filter(function (item) {
        var ms = !hasStyleFilter || selectedStyles[item.style];
        var mg =
          selectedGender === "all" ||
          item.gender === selectedGender ||
          item.gender === "neutral";
        return ms && mg;
      });

      if (poolAdj.length === 0) poolAdj = adjectives;
      if (poolNoun.length === 0) poolNoun = nouns;

      var results = [];
      var used = {};
      var maxAttempts = RESULT_COUNT * 20;
      var attempts = 0;
      var userWord = { word: capitalized, style: "custom", gender: "neutral" };

      while (results.length < RESULT_COUNT && attempts < maxAttempts) {
        attempts++;
        var asAdj = Math.random() < 0.5;
        var adj, noun;
        if (asAdj) {
          adj = userWord;
          noun = poolNoun[Math.floor(Math.random() * poolNoun.length)];
        } else {
          adj = poolAdj[Math.floor(Math.random() * poolAdj.length)];
          noun = userWord;
        }
        var tag = stylizeTag(adj.word, noun.word);
        if (used[tag]) continue;
        used[tag] = true;
        results.push({
          tag: tag,
          style: asAdj ? noun.style : adj.style,
          gender: asAdj ? noun.gender : adj.gender,
        });
      }

      renderResults(results);
      return;
    }

    // Fallback if filters too strict
    if (filtAdj.length === 0) filtAdj = adjectives;
    if (filtNoun.length === 0) filtNoun = nouns;

    var results = [];
    var used = {};
    var maxAttempts = RESULT_COUNT * 20;
    var attempts = 0;

    while (results.length < RESULT_COUNT && attempts < maxAttempts) {
      attempts++;
      var adj = filtAdj[Math.floor(Math.random() * filtAdj.length)];
      var noun = filtNoun[Math.floor(Math.random() * filtNoun.length)];

      if (adj.word === noun.word) continue;

      var tag = stylizeTag(adj.word, noun.word);
      if (used[tag]) continue;
      used[tag] = true;

      results.push({
        tag: tag,
        style: adj.style,
        gender: noun.gender,
      });
    }

    renderResults(results);
  }

  // ===== Render =====
  function renderResults(items) {
    resultCount.textContent = items.length + " results";

    if (items.length === 0) {
      resultsGrid.innerHTML =
        '<div class="results__empty" role="listitem">' +
        '<span class="material-icons results__empty-icon" aria-hidden="true">search_off</span>' +
        "<p>No matches found. Try different filters.</p>" +
        "</div>";
      return;
    }

    resultsGrid.innerHTML = "";

    items.forEach(function (item, i) {
      var card = document.createElement("div");
      card.className = "card card--animate";
      card.setAttribute("role", "listitem");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Copy " + item.tag);
      card.style.animationDelay = i * 0.06 + "s";

      var num = String(i + 1).padStart(3, "0");
      var styleName = STYLE_LABELS[item.style] || item.style;
      var genderName =
        item.gender.charAt(0).toUpperCase() + item.gender.slice(1);

      card.innerHTML =
        '<div class="card__top">' +
        '<span class="card__num">#' + num + "</span>" +
        '<span class="material-icons card__copy-icon">content_copy</span>' +
        "</div>" +
        '<div class="card__tag">' + item.tag + "</div>" +
        '<div class="card__meta">' + styleName + " &bull; " + genderName + "</div>";

      function handleCopy() {
        copyToClipboard(item.tag, card);
      }

      card.addEventListener("click", handleCopy);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCopy();
        }
      });

      resultsGrid.appendChild(card);
    });
  }

  // ===== Copy =====
  function copyToClipboard(text, card) {
    if (!navigator.clipboard) return;

    navigator.clipboard.writeText(text).then(function () {
      card.classList.add("card--copied");

      // Replace copy icon with badge
      var iconEl = card.querySelector(".card__copy-icon");
      if (iconEl) {
        var badge = document.createElement("span");
        badge.className = "card__copied-badge";
        badge.textContent = "Copied!";
        iconEl.parentNode.replaceChild(badge, iconEl);
      }

      setTimeout(function () {
        card.classList.remove("card--copied");
        var badgeEl = card.querySelector(".card__copied-badge");
        if (badgeEl) {
          var icon = document.createElement("span");
          icon.className = "material-icons card__copy-icon";
          icon.textContent = "content_copy";
          badgeEl.parentNode.replaceChild(icon, badgeEl);
        }
      }, COPY_FEEDBACK_MS);
    });
  }

  // ===== Auto-generate on load =====
  generate();
})();
