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

export function exportAsPDF(
  data: TechStack[] | Asset[],
  filename: string,
  isTechStack: boolean,
) {
  // Simple PDF generation using basic HTML to PDF approach
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f0f0f0; border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold; }
        td { border: 1px solid #ddd; padding: 10px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .critical { color: #dc2626; font-weight: bold; }
        .high { color: #ea580c; font-weight: bold; }
        .medium { color: #ca8a04; font-weight: bold; }
        .low { color: #16a34a; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${isTechStack ? "Tech Stack Inventory" : "Asset Inventory"}</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <table>
  `;

  if (isTechStack) {
    html += `
      <thead>
        <tr>
          <th>Name</th>
          <th>Version</th>
          <th>Type</th>
          <th>Risk Level</th>
          <th>CVEs</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
    `;
    (data as TechStack[]).forEach((item) => {
      html += `
        <tr>
          <td>${item.name}</td>
          <td>v${item.version}</td>
          <td>${item.type}</td>
          <td class="${item.riskLevel}">${item.riskLevel}</td>
          <td>${item.cves.length}</td>
          <td>${item.isEOL ? "EOL" : item.isUpgradable ? "Upgradable" : "Current"}</td>
        </tr>
      `;
    });
  } else {
    html += `
      <thead>
        <tr>
          <th>Asset Name</th>
          <th>Type</th>
          <th>Risk Level</th>
          <th>Tech Stacks</th>
          <th>CVEs</th>
          <th>Last Seen</th>
          <th>First Seen</th>
        </tr>
      </thead>
      <tbody>
    `;
    (data as Asset[]).forEach((item) => {
      html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.type}</td>
          <td class="${item.riskLevel}">${item.riskLevel}</td>
          <td>${item.techStacks.length}</td>
          <td>${item.cveCount}</td>
          <td>${item.lastSeen.toLocaleDateString()}</td>
          <td>${item.firstSeen.toLocaleDateString()}</td>
        </tr>
      `;
    });
  }

  html += `
      </tbody>
      </table>
    </body>
    </html>
  `;

  downloadFile(html, filename, "application/pdf");
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
