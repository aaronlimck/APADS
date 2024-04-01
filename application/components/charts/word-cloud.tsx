"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

interface WordCloudProps {
  words: string[];
}

function calculateWordFrequencies(
  words: string[],
): { text: string; size: number }[] {
  const wordFrequencies = words.reduce((acc: any, word: any) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  // Create a logarithmic scale for the word sizes
  const sizeScale = d3.scaleLog().range([15, 30]); // Adjust range as needed

  return Object.entries(wordFrequencies).map(([text, size]) => ({
    text,
    size: sizeScale(size as any),
  }));
}

function draw(wordCloudRef: React.RefObject<SVGSVGElement>, words: any) {
  d3.select(wordCloudRef.current)
    .append("g")
    .attr("transform", "translate(150,150)") // Adjust translation as needed
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", (d: any) => d.size + "px")
    .style("font-family", "Impact")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      (d: any) => `translate(${[d.x, d.y]})rotate(${d.rotate})`,
    )
    .attr("fill", () => "black") // Add fill for color
    .text((d: any) => d.text);
}

const WordCloudComponent: React.FC<WordCloudProps> = ({ words }) => {
  const wordCloudRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (wordCloudRef.current && words.length > 0) {
      const wordData = calculateWordFrequencies(words);

      const layout = cloud()
        .size([300, 300]) // Adjust size as needed
        .words(wordData)
        .padding(5) // Adjust padding as needed
        .rotate(() => 0) // Make all words horizontal
        .font("Impact")
        .fontSize((d) => d.size || 0) // Handle undefined values by providing a default value
        .on("end", (words: any) => draw(wordCloudRef, words));

      layout.start();
    }

    // Cleanup function to remove the previous word cloud
    return () => {
      if (wordCloudRef.current) {
        d3.select(wordCloudRef.current).selectAll("*").remove();
      }
    };
  }, [words]);

  return <svg ref={wordCloudRef} width="300" height="300" />;
};

export default WordCloudComponent;
