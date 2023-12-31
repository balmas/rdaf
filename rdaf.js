function init() {

  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make;  // for conciseness in defining templates

  myDiagram = new go.Diagram("myDiagramDiv",  // must name or refer to the DIV HTML element
    {
      initialContentAlignment: go.Spot.Left,
      allowSelect: false,  // the user cannot select any part
      // create a TreeLayout for the decision tree
      layout: $(go.TreeLayout, { arrangement: go.TreeLayout.ArrangementFixedRoots })
    });

  // custom behavior for expanding/collapsing half of the subtree from a node
  function buttonExpandCollapse(e, port) {
    var node = port.part;
    node.diagram.startTransaction("expand/collapse");
    var portid = port.portId;
    links = node.findLinksOutOf(portid);
    collapsed = false;
    links.each(l => {
      if (l.visible) {
        // collapse whole subtree recursively
	collapsed = true;
        collapseTree(node, portid);
      } else if (! collapsed) {
        // only expands immediate children and their links
        l.visible = true;
        var n = l.getOtherNode(node);
        if (n !== null) {
          n.location = node.getDocumentPoint(go.Spot.TopRight);
          n.visible = true;
        }
      }
    });
    myDiagram.toolManager.hideToolTip();
    node.diagram.commitTransaction("expand/collapse");
  }

  // recursive function for collapsing complete subtree
  function collapseTree(node, portid) {
    node.findLinksOutOf(portid).each(l => {
      l.visible = false;
      var n = l.getOtherNode(node);
      if (n !== null) {
        n.visible = false;
        collapseTree(n, null);  // null means all links, not just for a particular portId
      }
    });
  }

  // get the text for the tooltip from the data on the object being hovered over
  function tooltipTextConverter(data) {
    var str = "";
    var e = myDiagram.lastInput;
    var currobj = e.targetObject;
    category = null;
    if (currobj !== null) {
	console.log(currobj)
	if (currobj.panel !== null) {
            category = currobj.panel.name.split('-')[1];
        } else {
            category = currobj.name.split('-')[1];
	}
    }
    console.log(category)
    if (category !== null) {
        str = data[category + "ToolTip"];
    }
    return str;
  }

  // define tooltips for buttons
  var tooltipTemplate =
    $("ToolTip",
      { "Border.fill": "whitesmoke", "Border.stroke": "lightgray" },
      $(go.TextBlock,
        {
          font: "8pt sans-serif",
          wrap: go.TextBlock.WrapFit,
          desiredSize: new go.Size(200, NaN),
          alignment: go.Spot.Center,
          margin: 6
        },
        new go.Binding("text", "", tooltipTextConverter))
    );

  // define the Node template for non-leaf nodes
  myDiagram.nodeTemplateMap.add("stage",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "20px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "text")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "button-a",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          ),  // end button A
          $("Button",  // button B
            {
              name: "button-b",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "b"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "bText"))
          )  // end button B
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add
  myDiagram.nodeTemplateMap.add("outcome",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "20px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "text")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "button-a",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          )
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add
  myDiagram.nodeTemplateMap.add("activity",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "20px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "text")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "Button-a",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          ),  // end button A
          $("Button",  // button B
            {
              name: "Button-b",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "b"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "bText"))
          ),  // end button B
          $("Button",  // button C
            {
              name: "Button-c",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "c"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "cText"))
          ),  // end button C
          $("Button",  // button D
            {
              name: "Button-d",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "d"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "dText"))
          )  // end button D
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add

  myDiagram.nodeTemplateMap.add("topic",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "20px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "text")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "button-a",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          ),  // end button A
          $("Button",  // button B
            {
              name: "button-b",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "b"),
            $(go.TextBlock,
              { font: '500 10px Roboto, sans-serif' },
              new go.Binding("text", "bText"))
          )  // end button A
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add

  // define the Node template for leaf nodes
  myDiagram.nodeTemplateMap.add("consideration",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      $(go.TextBlock,
        {
          font: '9px Roboto, sans-serif',
          wrap: go.TextBlock.WrapFit, desiredSize: new go.Size(200, NaN), margin: 5
        },
        new go.Binding("text", "text"))
    ));
  myDiagram.nodeTemplateMap.add("participant",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      $(go.TextBlock,
        {
          font: '9px Roboto, sans-serif',
          wrap: go.TextBlock.WrapFit, desiredSize: new go.Size(200, NaN), margin: 5
        },
        new go.Binding("text", "text"))
    ));
  myDiagram.nodeTemplateMap.add("participant_group",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      $(go.TextBlock,
        {
          font: '9px Roboto, sans-serif',
          wrap: go.TextBlock.WrapFit, desiredSize: new go.Size(200, NaN), margin: 5
        },
        new go.Binding("text", "text"))
    ));
  myDiagram.nodeTemplateMap.add("method",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      $(go.TextBlock,
        {
          font: '9px Roboto, sans-serif',
          wrap: go.TextBlock.WrapFit, desiredSize: new go.Size(200, NaN), margin: 5
        },
        new go.Binding("text", "text"))
    ));
  myDiagram.nodeTemplateMap.add("exemplar",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      $(go.TextBlock,
        {
          font: '9px Roboto, sans-serif',
          wrap: go.TextBlock.WrapFit, desiredSize: new go.Size(200, NaN), margin: 5
        },
        new go.Binding("text", "text"))
    ));

  // define the only Link template
  myDiagram.linkTemplate =
    $(go.Link, go.Link.Orthogonal,  // the whole link panel
      { fromPortId: "" },
      new go.Binding("fromPortId", "fromport"),
      $(go.Shape,  // the link shape
        { stroke: "lightblue", strokeWidth: 2 })
    );

  // create the model for the decision tree
  makeNodes();
}

function makeDiagram(entities,links) {
  var model =
    new go.GraphLinksModel(
      { linkFromPortIdProperty: "fromport" });
  // set up the model with the node and link data
  model.nodeDataArray = entities;
  model.linkDataArray = links;
  myDiagram.model = model;
  // make all but the start node invisible
  myDiagram.nodes.each(n => {
    if (n.text !== "Stages") n.visible = false;
  });
  myDiagram.links.each(l => {
    l.visible = false;
  });
}

function makeNodes() {
  entities = [];
  fetch('entities.json')
   .then(response => response.json())
   .then(data => {
     entities = data;
     fetch('links.json')
      .then(response => response.json())
      .then(data => {
         links = data;
	 makeDiagram(entities,links);
       })
       .catch(error => {
          console.error('Error:', error);
       })
   })
   .catch(error => {
      console.error('Error:', error);
  });
}

window.addEventListener('DOMContentLoaded', init);
