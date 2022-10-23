/**
 * Returns an array of DOMRects, where each represents a single line of text.
 */
export function textNodeLineRects(textNode: Text): DOMRect[] {
  const range = new Range();
  range.selectNode(textNode);
  const rects = Array.from(range.getClientRects());
  range.detach();
  return rects;
}

/**
 * Returns text content broken into lines that browser rendered.
 * Source: https://www.bennadel.com/blog/4310-detecting-rendered-line-breaks-in-a-text-node-in-javascript.htm
 */
export function textNodeByLines(textNode: Text): string[] {
  if (textNode.nodeType !== 3) {
    throw new Error("Lines can only be extracted from text nodes.");
  }

  // BECAUSE SAFARI: None of the "modern" browsers seem to care about the actual
  // layout of the underlying markup. However, Safari seems to create range
  // rectangles based on the physical structure of the markup (even when it
  // makes no difference in the rendering of the text). As such, let's rewrite
  // the text content of the node to REMOVE SUPERFLUOS WHITE-SPACE. This will
  // allow Safari's .getClientRects() to work like the other modern browsers.
  // textNode.textContent = collapseWhiteSpace(textNode.textContent);

  // A Range represents a fragment of the document which contains nodes and
  // parts of text nodes. One thing that's really cool about a Range is that we
  // can access the bounding boxes that contain the contents of the Range. By
  // incrementally adding characters - from our text node - into the range, and
  // then looking at the Range's client rectangles, we can determine which
  // characters belong in which rendered line.
  var textContent = textNode.textContent ?? "";
  var range = document.createRange();
  var lines: any[] = [];
  var lineCharacters = [];

  // Iterate over every character in the text node.
  for (var i = 0; i < textContent.length; i++) {
    // Set the range to span from the beginning of the text node up to and
    // including the current character (offset).
    range.setStart(textNode, 0);
    range.setEnd(textNode, i + 1);

    // At this point, the Range's client rectangles will include a rectangle
    // for each visually-rendered line of text. Which means, the last
    // character in our Range (the current character in our for-loop) will be
    // the last character in the last line of text (in our Range). As such, we
    // can use the current rectangle count to determine the line of text.
    var lineIndex = range.getClientRects().length - 1;

    // If this is the first character in this line, create a new buffer for
    // this line.
    if (!lines[lineIndex]) {
      lines.push((lineCharacters = []));
    }

    // Add this character to the currently pending line of text.
    lineCharacters.push(textContent.charAt(i));
  }

  /**
   * I normalize the white-space in the given value such that the amount of white-
   * space matches the rendered white-space (browsers collapse strings of white-space
   * down to single space character, visually, and this is just updating the text to
   * match that behavior).
   */

  // At this point, we have an array (lines) of arrays (characters). Let's
  // collapse the character buffers down into a single text value.
  lines = lines.map(function operator(characters) {
    return characters.join("").trim().replace(/\s+/g, " ");
  });

  // DEBUGGING: Draw boxes around our client rectangles.
  // drawRectBoxes(range.getClientRects());

  return lines;
}
