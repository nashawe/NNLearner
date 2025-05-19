"use client";
import React, { useState, useCallback } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";

// helper to build nodes
const makeNode = (id, label, x, y, tooltip, layer) => ({
  id,
  position: { x, y },
  data: { label, tooltip },
  style: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    background:
      layer === "input"
        ? "#dbeafe"
        : layer === "output"
        ? "#fcd34d"
        : "#c7d2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #6366f1",
    color: "#1e3a8a",
    fontWeight: 600,
    cursor: "pointer",
  },
  draggable: false,
  sourcePosition: "right",
  targetPosition: "left",
});

const inputNodes = [0, 1, 2].map((i) =>
  makeNode(`in-${i}`, "I", 0, i * 100, "Input neuron", "input")
);

const hidden1 = [0, 1, 2, 3, 4].map((i) =>
  makeNode(
    `h1-${i}`,
    "H1",
    200,
    i * 80 - 40,
    "Hidden neuron with ReLU activation",
    "hidden"
  )
);

const hidden2 = [0, 1, 2, 3, 4].map((i) =>
  makeNode(
    `h2-${i}`,
    "H2",
    400,
    i * 80 - 40,
    "Hidden neuron with ReLU activation",
    "hidden"
  )
);

const outputNodes = [0, 1].map((i) =>
  makeNode(`out-${i}`, "O", 600, i * 100, "Output neuron (Softmax)", "output")
);

const allNodes = [...inputNodes, ...hidden1, ...hidden2, ...outputNodes];

// build fully-connected edges layer-by-layer
const makeEdges = (fromLayer, toLayer) => {
  const edges = [];
  fromLayer.forEach((from) => {
    toLayer.forEach((to) => {
      edges.push({
        id: `${from.id}-${to.id}`,
        source: from.id,
        target: to.id,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6366f1",
          width: 12,
          height: 12,
        },
        style: { stroke: "#6366f1" },
      });
    });
  });
  return edges;
};

const edges = [
  ...makeEdges(inputNodes, hidden1),
  ...makeEdges(hidden1, hidden2),
  ...makeEdges(hidden2, outputNodes),
];

export default function NNAnatomy() {
  const [highlighted, setHighlighted] = useState([]);

  const runForward = useCallback(() => {
    const layers = [inputNodes, hidden1, hidden2, outputNodes];
    let delay = 0;
    layers.forEach((layer) => {
      setTimeout(() => {
        setHighlighted(layer.map((n) => n.id));
      }, delay);
      delay += 600;
    });
    setTimeout(() => setHighlighted([]), delay + 600);
  }, []);

  const nodes = allNodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      background: highlighted.includes(node.id)
        ? "#4f46e5"
        : node.style.background,
      color: highlighted.includes(node.id) ? "#ffffff" : node.style.color,
    },
    data: {
      ...node.data,
      onMouseEnter: () => {
        const tooltip = document.getElementById(`tooltip-${node.id}`);
        if (tooltip) tooltip.style.opacity = "1";
      },
      onMouseLeave: () => {
        const tooltip = document.getElementById(`tooltip-${node.id}`);
        if (tooltip) tooltip.style.opacity = "0";
      },
    },
  }));

  return (
    <section id="anatomy" className="bg-gray-900 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-white mb-8">
          Neural Network Anatomy
        </h2>

        <div className="h-[500px] border rounded-xl relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodesDraggable={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            panOnScroll={false}
            zoomActivationKeyCode={null}
          >
            <Background gap={20} size={1} />
            <Controls />
          </ReactFlow>
          {allNodes.map((node) => (
            <div
              key={`tooltip-${node.id}`}
              id={`tooltip-${node.id}`}
              style={{
                position: "absolute",
                top: node.position.y + 10,
                left: node.position.x + 80,
                padding: "4px 8px",
                background: "rgba(0,0,0,0.75)",
                color: "#fff",
                borderRadius: "4px",
                opacity: 0,
                transition: "opacity 0.2s",
                pointerEvents: "none",
              }}
            >
              {node.data.tooltip}
            </div>
          ))}
        </div>

        <button
          onClick={runForward}
          className="mt-8 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Run Forward Pass
        </button>
      </div>
    </section>
  );
}
