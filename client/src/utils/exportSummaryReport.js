import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const extractSummaryBlocks = (summary) => {
  if (!summary) return [{ title: "Generated Summary", content: "No AI summary generated." }];

  if (typeof summary === "object" && summary !== null) {
    const blocks = [];

    if (summary.description) {
      blocks.push({ title: "Description", content: normalizeText(summary.description) });
    }
    if (summary.insights) {
      blocks.push({ title: "Key Insights", content: normalizeText(summary.insights) });
    }
    if (summary.suggestions) {
      blocks.push({ title: "Suggestions", content: normalizeText(summary.suggestions) });
    }

    if (blocks.length > 0) return blocks;
    return [{ title: "Generated Summary", content: normalizeText(summary) }];
  }

  const text = normalizeText(summary).trim();
  if (!text) return [{ title: "Generated Summary", content: "No AI summary generated." }];

  try {
    const parsed = JSON.parse(text);
    return extractSummaryBlocks(parsed);
  } catch {
    return [{ title: "Generated Summary", content: text }];
  }
};

const toReportSections = ({ metadata, columnStats, numericStats, topCategories, summary }) => {
  const now = new Date().toLocaleString();

  return {
    title: "FilterExcel Summary Report",
    generatedOn: now,
    overview: [
      `Rows: ${metadata?.rows ?? 0}`,
      `Columns: ${metadata?.columns ?? 0}`,
      `Numeric Columns: ${numericStats?.length ?? 0}`,
      `Categorical Columns: ${topCategories?.length ?? 0}`,
    ],
    columnOverview:
      (columnStats || []).map(
        (item) => `${item.column}: Type=${item.type}, Null%=${item.nulls}, Unique=${item.unique}`
      ) || [],
    numericColumnStats:
      (numericStats || []).map(
        (item) =>
          `${item.column}: Min=${item.min}, Max=${item.max}, Mean=${item.mean}, Median=${item.median}, StdDev=${item.std}`
      ) || [],
    frequentValues:
      (topCategories || []).map((category) => ({
        title: category.column,
        values: (category.values || []).map(
          ([value, count]) => `${value}: ${count} occurrences`
        ),
      })) || [],
    summaryBlocks: extractSummaryBlocks(summary),
  };
};

const withFallback = (items, fallbackText) =>
  items && items.length > 0 ? items : [fallbackText];

const drawWrappedLine = (doc, text, x, y, maxWidth, lineHeight, marginBottom) => {
  const wrappedLines = doc.splitTextToSize(String(text || " "), maxWidth);
  let currentY = y;

  wrappedLines.forEach((line) => {
    if (currentY > doc.internal.pageSize.getHeight() - marginBottom) {
      doc.addPage();
      currentY = marginBottom;
    }
    doc.text(String(line), x, currentY);
    currentY += lineHeight;
  });

  return currentY;
};

const addSectionTitle = (doc, title, x, y, maxWidth, marginBottom) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const newY = drawWrappedLine(doc, title, x, y, maxWidth, 18, marginBottom);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  return newY;
};

export const exportSummaryReportToPDF = (reportData, fileName = "summary-report.pdf") => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  const sectionGap = 14;

  let y = margin + 4;
  const lineHeight = 16;
  const report = toReportSections(reportData);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  y = drawWrappedLine(doc, report.title, margin, y, maxWidth, 22, margin);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = drawWrappedLine(doc, `Generated on: ${report.generatedOn}`, margin, y, maxWidth, lineHeight, margin);
  y += sectionGap;

  y = addSectionTitle(doc, "Overview", margin, y, maxWidth, margin);
  withFallback(report.overview, "No overview available.").forEach((line) => {
    y = drawWrappedLine(doc, `• ${line}`, margin, y, maxWidth, lineHeight, margin);
  });
  y += sectionGap;

  y = addSectionTitle(doc, "Column Overview", margin, y, maxWidth, margin);
  withFallback(report.columnOverview, "No columns available.").forEach((line) => {
    y = drawWrappedLine(doc, `• ${line}`, margin, y, maxWidth, lineHeight, margin);
  });
  y += sectionGap;

  y = addSectionTitle(doc, "Numeric Column Stats", margin, y, maxWidth, margin);
  withFallback(report.numericColumnStats, "No numeric columns available.").forEach((line) => {
    y = drawWrappedLine(doc, `• ${line}`, margin, y, maxWidth, lineHeight, margin);
  });
  y += sectionGap;

  y = addSectionTitle(doc, "Frequent Values", margin, y, maxWidth, margin);
  if (!report.frequentValues.length) {
    y = drawWrappedLine(doc, "• No categorical columns available.", margin, y, maxWidth, lineHeight, margin);
  } else {
    report.frequentValues.forEach((group) => {
      y = drawWrappedLine(doc, `• ${group.title}`, margin, y, maxWidth, lineHeight, margin);
      group.values.forEach((value) => {
        y = drawWrappedLine(doc, `   - ${value}`, margin + 10, y, maxWidth - 10, lineHeight, margin);
      });
    });
  }
  y += sectionGap;

  if (y > pageHeight - margin * 2) {
    doc.addPage();
    y = margin;
  }

  y = addSectionTitle(doc, "AI Summary", margin, y, maxWidth, margin);
  report.summaryBlocks.forEach((block) => {
    y = drawWrappedLine(doc, block.title, margin, y, maxWidth, lineHeight, margin);

    const text = normalizeText(block.content)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!text.length) {
      y = drawWrappedLine(doc, "• No additional details.", margin + 10, y, maxWidth - 10, lineHeight, margin);
    } else {
      text.forEach((line) => {
        y = drawWrappedLine(doc, `• ${line}`, margin + 10, y, maxWidth - 10, lineHeight, margin);
      });
    }

    y += 6;
  });

  doc.save(fileName);
};

export const exportSummaryReportToWord = async (
  reportData,
  fileName = "summary-report.docx"
) => {
  const report = toReportSections(reportData);

  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      children: [new TextRun(report.title)],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun(`Generated on: ${report.generatedOn}`)],
      spacing: { after: 260 },
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun("Overview")],
    }),
    ...withFallback(report.overview, "No overview available.").map(
      (line) =>
        new Paragraph({
          children: [new TextRun(line)],
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
    ),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun("Column Overview")],
      spacing: { before: 200 },
    }),
    ...withFallback(report.columnOverview, "No columns available.").map(
      (line) =>
        new Paragraph({
          children: [new TextRun(line)],
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
    ),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun("Numeric Column Stats")],
      spacing: { before: 200 },
    }),
    ...withFallback(report.numericColumnStats, "No numeric columns available.").map(
      (line) =>
        new Paragraph({
          children: [new TextRun(line)],
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
    ),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun("Frequent Values")],
      spacing: { before: 200 },
    }),
  ];

  if (!report.frequentValues.length) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun("No categorical columns available.")],
        bullet: { level: 0 },
        spacing: { after: 80 },
      })
    );
  } else {
    report.frequentValues.forEach((group) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(group.title)],
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
      );

      group.values.forEach((value) => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(value)],
            bullet: { level: 1 },
            spacing: { after: 80 },
          })
        );
      });
    });
  }

  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun("AI Summary")],
      spacing: { before: 200 },
    })
  );

  report.summaryBlocks.forEach((block) => {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun(block.title)],
        spacing: { before: 140, after: 100 },
      })
    );

    const lines = normalizeText(block.content)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun("No additional details.")],
          bullet: { level: 0 },
        })
      );
      return;
    }

    lines.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(line)],
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
      );
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
};
