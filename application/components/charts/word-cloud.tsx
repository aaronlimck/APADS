"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface WordCloudProps {
  words: string[];
}

function calculateWordFrequencies(words: string[]): { text: string; size: number }[] {
  const wordFrequencies = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(wordFrequencies).map(([text, size]) => ({ text, size: size * 25 })); // Adjust size as needed
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
        .rotate(() => ~~(Math.random() * 2) * 90) // Adjust rotation as needed
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw);

      layout.start();

      function draw(words) {
        d3.select(wordCloudRef.current)
          .append("g")
          .attr("transform", "translate(150,150)") // Adjust translation as needed
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", d => d.size + "px")
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .attr("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)]) // Add fill for color
          .text(d => d.text);
      }
    }

    // Cleanup function to remove the previous word cloud
    return () => {
      if (wordCloudRef.current) {
        d3.select(wordCloudRef.current).selectAll("*").remove();
      }
    };
  }, [words]);

  return <svg ref={wordCloudRef} width="300" height="300" />; // Adjust width and height as needed
};

export default WordCloudComponent;