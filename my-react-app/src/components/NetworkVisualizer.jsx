import React, {
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactFlow, { Background, Controls, BezierEdge } from "reactflow";
import "reactflow/dist/style.css";

/**
 * A feed-forward neural net viewer with stage-by-stage pulses
 * using async/await for smooth, glitch-free animation.
 */

// Let edges default to "bezier" for smooth curves
const defaultEdgeOptions = { type: "bezier" };

const NetworkVisualizer = forwardRef(
  ({ inputSize, outputSize, numLayers, neuronsPerLayer }, ref) => {
    const [activeNodes, setActiveNodes] = useState([]);
    const [activeEdges, setActiveEdges] = useState([]);

    // total layers = input + hidden(s) + output
    const totalLayers = numLayers + 2;

    // e.g. [4, 8, 8, 2]
    const layerSizes = useMemo(() => {
      return [inputSize, ...Array(numLayers).fill(neuronsPerLayer), outputSize];
    }, [inputSize, outputSize, numLayers, neuronsPerLayer]);

    // A small helper to wait in an async function
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /**
     * startTrainingSimulation
     * - Lights up each layer i, edges (i -> i+1), then layer i+1
     * - Waits a fixed delay between each stage
     * - Returns when the final layer is lit
     */
    const startTrainingSimulation = async () => {
      console.log("✨ Starting a forward-pass animation");
      // Clear out any old highlights
      setActiveNodes([]);
      setActiveEdges([]);

      // We'll hold updated arrays locally before setting them
      let updatedNodes = [];
      let updatedEdges = [];

      // Each forward pass goes layer by layer
      for (let i = 0; i < totalLayers - 1; i++) {
        // 1) Light up layer i
        for (let n = 0; n < layerSizes[i]; n++) {
          const nodeId = `${i}-${n}`;
          if (!updatedNodes.includes(nodeId)) {
            updatedNodes.push(nodeId);
          }
        }
        setActiveNodes([...updatedNodes]);
        await wait(400);

        // 2) Light up edges from layer i -> i+1
        const fromSize = layerSizes[i];
        const toSize = layerSizes[i + 1];
        for (let f = 0; f < fromSize; f++) {
          for (let t = 0; t < toSize; t++) {
            const edgeId = `e-${i}-${f}-${i + 1}-${t}`;
            if (!updatedEdges.includes(edgeId)) {
              updatedEdges.push(edgeId);
            }
          }
        }
        setActiveEdges([...updatedEdges]);
        await wait(400);

        // 3) Light up layer i+1
        for (let n = 0; n < layerSizes[i + 1]; n++) {
          const nodeId = `${i + 1}-${n}`;
          if (!updatedNodes.includes(nodeId)) {
            updatedNodes.push(nodeId);
          }
        }
        setActiveNodes([...updatedNodes]);
        await wait(400);
      }
      console.log("✅ Forward-pass animation finished");
    };

    // Expose startAnimation() to parent
    useImperativeHandle(ref, () => ({
      startAnimation: startTrainingSimulation,
    }));

    /**
     * Build the nodes array for React Flow
     */
    const nodes = useMemo(() => {
      const allNodes = [];

      layerSizes.forEach((layerSize, layerIdx) => {
        const isInput = layerIdx === 0;
        const isOutput = layerIdx === totalLayers - 1;

        for (let i = 0; i < layerSize; i++) {
          const id = `${layerIdx}-${i}`;
          const x = layerIdx * 180;
          const y = i * 60 - (layerSize * 60) / 2;
          const isActive = activeNodes.includes(id);

          const sourcePos = isOutput ? undefined : "right";
          const targetPos = isInput ? undefined : "left";

          let color;
          if (isInput) color = "#38bdf8"; // input = blue
          else if (isOutput) color = "#fb923c"; // output = orange
          else color = "#a78bfa"; // hidden = purple

          allNodes.push({
            id,
            position: { x, y },
            data: { label: "" },
            sourcePosition: sourcePos,
            targetPosition: targetPos,
            style: {
              width: 20,
              height: 20,
              backgroundColor: color,
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: isActive
                ? "0 0 15px 5px rgba(34,197,94,0.8)"
                : "0 0 5px rgba(255,255,255,0.3)",
              transition: "box-shadow 0.3s ease",
            },
          });
        }
      });

      return allNodes;
    }, [layerSizes, activeNodes, totalLayers]);

    /**
     * Build edges array for React Flow
     */
    const edges = useMemo(() => {
      const allEdges = [];

      for (let layerIdx = 0; layerIdx < totalLayers - 1; layerIdx++) {
        const fromSize = layerSizes[layerIdx];
        const toSize = layerSizes[layerIdx + 1];

        for (let i = 0; i < fromSize; i++) {
          for (let j = 0; j < toSize; j++) {
            const edgeId = `e-${layerIdx}-${i}-${layerIdx + 1}-${j}`;
            const isEdgeActive = activeEdges.includes(edgeId);

            allEdges.push({
              id: edgeId,
              source: `${layerIdx}-${i}`,
              target: `${layerIdx + 1}-${j}`,
              type: "bezier",
              animated: isEdgeActive,
              style: {
                stroke: isEdgeActive ? "#22c55e" : "#94a3b8",
                strokeWidth: isEdgeActive ? 2.5 : 1.5,
              },
            });
          }
        }
      }

      return allEdges;
    }, [layerSizes, activeEdges, totalLayers]);

    return (
      <div
        style={{ width: "100%", height: "100%", backgroundColor: "#0f0f0f" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          defaultEdgeOptions={defaultEdgeOptions}
          edgeTypes={{ bezier: BezierEdge }}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background color="#1f1f1f" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    );
  }
);

export default NetworkVisualizer;
