import { TechStack, Asset } from "@/data/mockData";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function exportAsCSV(
  data: TechStack[] | Asset[],
  filename: string,
  isTechStack: boolean,
) {
  let csv = "";

  if (isTechStack) {
    csv = "Name,Version,Type,Risk Level,CVE Count,EOL,Upgradable\n";
    (data as TechStack[]).forEach((item) => {
      csv += `"${item.name}","v${item.version}","${item.type}","${item.riskLevel}",${item.cves.length},"${item.isEOL ? "Yes" : "No"}","${item.isUpgradable ? "Yes" : "No"}"\n`;
    });
  } else {
    csv =
      "Name,Type,Risk Level,Tech Stack Count,CVE Count,Last Seen,First Seen\n";
    (data as Asset[]).forEach((item) => {
      csv += `"${item.name}","${item.type}","${item.riskLevel}",${item.techStacks.length},${item.cveCount},"${item.lastSeen.toLocaleDateString()}","${item.firstSeen.toLocaleDateString()}"\n`;
    });
  }

  downloadFile(csv, filename, "text/csv");
}

export function exportAsJSON(data: TechStack[] | Asset[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, "application/json");
}

export async function exportAsPDF(
  data: TechStack[] | Asset[],
  filename: string,
  isTechStack: boolean,
) {
  // Create a temporary container for PDF generation
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "800px";
  container.style.backgroundColor = "white";
  container.style.padding = "20px";

  let html = `
    <div style="font-family: Arial, sans-serif;">
      <h1 style="color: #333; margin-bottom: 10px;">${isTechStack ? "Tech Stack Inventory" : "Asset Inventory"}</h1>
      <p style="color: #666; margin-bottom: 20px;">Generated on ${new Date().toLocaleDateString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
  `;

  if (isTechStack) {
    html += `
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Name</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Version</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Type</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Risk Level</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">CVEs</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Status</th>
        </tr>
      </thead>
      <tbody>
    `;
    (data as TechStack[]).forEach((item, index) => {
      const bgColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
      html += `
        <tr style="background-color: ${bgColor};">
          <td style="border: 1px solid #ddd; padding: 10px;">${item.name}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">v${item.version}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.type}</td>
          <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; color: ${getRiskColor(item.riskLevel)};">${item.riskLevel}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.cves.length}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.isEOL ? "EOL" : item.isUpgradable ? "Upgradable" : "Current"}</td>
        </tr>
      `;
    });
  } else {
    html += `
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Asset Name</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Type</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Risk Level</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Tech Stacks</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">CVEs</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">Last Seen</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold;">First Seen</th>
        </tr>
      </thead>
      <tbody>
    `;
    (data as Asset[]).forEach((item, index) => {
      const bgColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
      html += `
        <tr style="background-color: ${bgColor};">
          <td style="border: 1px solid #ddd; padding: 10px;">${item.name}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.type}</td>
          <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; color: ${getRiskColor(item.riskLevel)};">${item.riskLevel}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.techStacks.length}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.cveCount}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.lastSeen.toLocaleDateString()}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${item.firstSeen.toLocaleDateString()}</td>
        </tr>
      `;
    });
  }

  html += `
      </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case "critical":
      return "#dc2626";
    case "high":
      return "#ea580c";
    case "medium":
      return "#ca8a04";
    case "low":
      return "#16a34a";
    default:
      return "#000000";
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
