
import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";


import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";

const nodeStyle = {
  backgroundColor: "#1e293b",
  color: "#f8fafc",
  border: "1px solid #38bdf8",
  borderRadius: "8px",
  padding: "10px",
  fontSize: "12px",
  fontFamily: "Consolas, monospace",
  width: 190,
  textAlign: "center",
};


function layoutAST(nodes, edges) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "TB",
    nodesep: 45,
    ranksep: 85,
    marginx: 30,
    marginy: 30,
  });

  const nodeWidth = 190;
  const nodeHeight = 95;

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
      },
      sourcePosition: "bottom",
      targetPosition: "top",
    };
  });
}



function convertAST(ast) {
  const nodes = [];
  const edges = [];

  let nextId = 0;

  function visit(value, parentId = null, label = "") {
    if (value === null || value === undefined) {
      return;
    }

    // Recorrer arreglos de nodos del AST
    if (Array.isArray(value)) {
      value.forEach((element, index) => {
        visit(element, parentId, `${label}[${index}]`);
      });
      return;
    }

    // Los valores simples se mostrarán dentro del nodo padre
    if (typeof value !== "object") {
      return;
    }

    const id = String(++nextId);

    // Nombre principal del nodo
    const nodeType = value.type || label || "Objeto";

    // Propiedades simples que se mostrarán dentro del nodo
    const details = [];

    Object.entries(value).forEach(([key, child]) => {
      if (
        key === "type" ||
        key === "line" ||
        key === "column"
      ) {
        return;
      }

      if (
        child !== null &&
        child !== undefined &&
        typeof child !== "object"
      ) {
        details.push(`${key}: ${String(child)}`);
      }
    });

    // Etiqueta del nodo
    const nodeLabel = [
      nodeType,
      ...details
    ].join("\n");

    nodes.push({
      id,
      position: { x: 0, y: 0 },
      data: {
        label: nodeLabel,
      },
      style: {
        ...nodeStyle,
        whiteSpace: "pre-line",
      },
    });

    // Conexión con el nodo padre
    if (parentId !== null) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "smoothstep",
      });
    }

    // Recorrer únicamente los hijos que sean objetos
    Object.entries(value).forEach(([key, child]) => {
      if (
        key === "type" ||
        key === "line" ||
        key === "column" ||
        child === null ||
        child === undefined
      ) {
        return;
      }

      if (Array.isArray(child)) {
        visit(child, id, key);
      } else if (typeof child === "object") {
        visit(child, id, key);
      }
    });
  }

  if (ast) {
    visit(ast);
  }

  const organizedNodes = layoutAST(nodes, edges);

  return {
    nodes: organizedNodes,
    edges,
  };
}


function ASTGraph({ ast }) {
  const { nodes, edges } = useMemo(
    () => convertAST(ast),
    [ast]
  );

  return (
    <div style={{ width: "100%", height: "450px" }}>
      <ReactFlow
            nodes={nodes}
            edges={edges}
            defaultViewport={{ x: 40, y: 40, zoom: 0.8 }}
            minZoom={0.1}
            maxZoom={2}
            nodesDraggable={false}
            nodesConnectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default ASTGraph;
