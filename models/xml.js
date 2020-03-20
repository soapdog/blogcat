// from: https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets

// Evaluate an XPath expression aExpression against a given DOM node
// or Document object (aNode), returning the results as an array
// thanks wanderingstan at morethanwarm dot mail dot com for the
// initial work.
export function evaluateXPath(aNode, aExpr) {
    var xpe = new XPathEvaluator();
    var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
        aNode.documentElement : aNode.ownerDocument.documentElement);
    var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
    var found = [];
    var res;
    while (res = result.iterateNext())
        found.push(res);
    return found;
}


export function XPathAttribute(aNode, aExpr) {
    return evaluateXPath(aNode, aExpr)[0].nodeValue
}

export function XPathValue(aNode, aExpr, aTransformation) {
    try {
        let val = evaluateXPath(aNode, aExpr)[0].childNodes[0].nodeValue;

        if (val && typeof aTransformation == "function") {
            val = aTransformation(val);
        }

        return val;
    } catch (n) {
        return undefined;
    }
}