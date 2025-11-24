(() => {
  const blockedTags = new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEXTAREA",
    "INPUT"
  ]);

  const replacements = [
    { pattern: /\bartificial general intelligence\b/gi, replacement: "Merlin-class magic" },
    { pattern: /\bAGI\b/gi, replacement: "Merlin-class magic" },
    { pattern: /\bartificial intelligence\b/gi, replacement: "applied magic" },
    { pattern: /\bai(?:[-\s\u2011\u2012\u2013\u2014])?powered\b/gi, replacement: "magic-powered" },
    { pattern: /\bai(?:[-\s\u2011\u2012\u2013\u2014])?driven\b/gi, replacement: "magic-driven" },
    { pattern: /\bai(?:[-\s\u2011\u2012\u2013\u2014])?native\b/gi, replacement: "magic-native" },
    { pattern: /\bai(?:[-\s\u2011\u2012\u2013\u2014])?first\b/gi, replacement: "magic-first" },
    { pattern: /\bai\s+assistant\b/gi, replacement: "arcane aide" },
    { pattern: /\b(?:generative|gen)\s*ai\b/gi, replacement: "creative magic" },
    { pattern: /\bvibe(?:[\s-\u2011\u2012\u2013\u2014])?coding\b/gi, replacement: "casting" },
    { pattern: /\bprompt engineering\b/gi, replacement: "incantation crafting" },
    { pattern: /\bchain(?:[\s-\u2011\u2012\u2013\u2014])of(?:[\s-\u2011\u2012\u2013\u2014])thought\b/gi, replacement: "thought ritual" },
    { pattern: /\bfunction calling\b/gi, replacement: "artifact binding" },
    { pattern: /\btool calling\b/gi, replacement: "artifact binding" },
    { pattern: /\bmachine learning\b/gi, replacement: "spell training" },
    { pattern: /\bdeep learning\b/gi, replacement: "ancient spellcraft" },
    { pattern: /\bneural networks\b/gi, replacement: "spell lattices" },
    { pattern: /\bneural network\b/gi, replacement: "spell lattice" },
    { pattern: /\bllm\b/gi, replacement: "language spellbook" },
    { pattern: /\blarge language model\b/gi, replacement: "language spellbook" },
    { pattern: /\b(?:ai|ml)\s+models\b/gi, replacement: "spellbooks" },
    { pattern: /\b(?:ai|ml)\s+model\b/gi, replacement: "spellbook" },
    { pattern: /\bprompting\b/gi, replacement: "spellcasting" },
    { pattern: /\bprompt\b/gi, replacement: "incantation" },
    { pattern: /\bchatbot\b/gi, replacement: "talking spirit" },
    { pattern: /\bai agent\b/gi, replacement: "summoned familiar" },
    { pattern: /\bagentic ai\b/gi, replacement: "summoned familiar" },
    { pattern: /\bco(?:[\s-\u2011\u2012\u2013\u2014])?pilot\b/gi, replacement: "familiar" },
    { pattern: /\bmultimodal\b/gi, replacement: "poly-scrying" },
    { pattern: /\bautomation\b/gi, replacement: "auto-spell" },
    { pattern: /\bretrieval(?:[-\s\u2011\u2012\u2013\u2014])?augmented generation\b/gi, replacement: "scry-and-summon" },
    { pattern: /\bRAG\b/g, replacement: "scry-and-summon" },
    { pattern: /\bpipeline\b/gi, replacement: "ritual chain" },
    { pattern: /\bfine(?:[-\s\u2011\u2012\u2013\u2014])?tuning\b/gi, replacement: "spell refinement" },
    { pattern: /\binference\b/gi, replacement: "spell execution" },
    { pattern: /\bvector database\b/gi, replacement: "rune vault" },
    { pattern: /\bvector store\b/gi, replacement: "glyph vault" },
    { pattern: /\bknowledge base\b/gi, replacement: "lorebook" },
    { pattern: /\bcontext window\b/gi, replacement: "scrying window" },
    { pattern: /\bcontext length\b/gi, replacement: "scrying range" },
    { pattern: /\b(?:token limit|max tokens)\b/gi, replacement: "sigil limit" },
    { pattern: /\btokenization\b/gi, replacement: "sigil carving" },
    { pattern: /\bchunking\b/gi, replacement: "scroll splitting" },
    { pattern: /\bgrounding\b/gi, replacement: "anchoring rune" },
    { pattern: /\bhallucinations?\b/gi, replacement: "phantom lore" },
    { pattern: /\bembeddings\b/gi, replacement: "rune set" },
    { pattern: /\bembedding\b/gi, replacement: "rune" },
    { pattern: /\bai\b/gi, replacement: "magic" }
  ];

  const hasLetters = /[A-Za-z]/;

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const applyCasing = (source, replacement) => {
    if (!hasLetters.test(source)) return replacement;
    const isAllCaps = source === source.toUpperCase() && source !== source.toLowerCase();
    const isCapitalized = source.charAt(0) === source.charAt(0).toUpperCase();
    if (isAllCaps || isCapitalized) return capitalize(replacement);
    return replacement;
  };

  const rewriteText = (text) =>
    replacements.reduce(
      (acc, { pattern, replacement }) =>
        acc.replace(pattern, (match) => applyCasing(match, replacement)),
      text
    );

  const shouldSkipNode = (node) => {
    let current = node.parentNode;
    while (current) {
      if (current.nodeType !== Node.ELEMENT_NODE) {
        current = current.parentNode;
        continue;
      }
      if (blockedTags.has(current.tagName)) return true;
      if (current.isContentEditable) return true;
      current = current.parentNode;
    }
    return false;
  };

  const processTextNode = (node) => {
    if (!node.nodeValue || !node.nodeValue.trim()) return;
    if (shouldSkipNode(node)) return;
    const updated = rewriteText(node.nodeValue);
    if (updated !== node.nodeValue) node.nodeValue = updated;
  };

  const walkerFilter = {
    acceptNode: (textNode) => {
      if (!textNode.nodeValue || !textNode.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return shouldSkipNode(textNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  };

  const walkAndRewrite = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, walkerFilter);
    while (walker.nextNode()) {
      processTextNode(walker.currentNode);
    }
  };

  const elementShouldBeSkipped = (element) => {
    let current = element;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      if (blockedTags.has(current.tagName)) return true;
      if (current.isContentEditable) return true;
      current = current.parentElement;
    }
    return false;
  };

  const handleMutations = (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE && !elementShouldBeSkipped(node)) {
            walkAndRewrite(node);
          }
        });
      } else if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
        processTextNode(mutation.target);
      }
    });
  };

  const start = () => {
    if (!document.body) return;
    walkAndRewrite(document.body);
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
