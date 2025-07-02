  function addSubject() {
    const container = document.getElementById('subjectsContainer');
    const html = `
      <div class="input-group mb-2">
        <input type="text" class="form-control subject-name" placeholder="Subject Name">
        <input type="number" class="form-control subject-score" placeholder="Score">
        <button class="btn btn-danger" onclick="removeSubject(this)">Remove</button>
      </div>`;
    container.insertAdjacentHTML('beforeend', html);
  }

  function removeSubject(btn) {
    btn.parentElement.remove();
  }

  function calculate() {
    const name = document.getElementById('studentName').value.trim();
    const subjectNames = document.querySelectorAll('.subject-name');
    const subjectScores = document.querySelectorAll('.subject-score');
    
    if (!name || subjectNames.length === 0) {
      alert("Please enter student name and at least one subject.");
      return;
    }

    let total = 0;
    let validCount = 0;
    let outputHTML = `<h5>Result for <strong>${name}</strong></h5><ul class="list-group mb-3">`;

    for (let i = 0; i < subjectNames.length; i++) {
      const subject = subjectNames[i].value.trim();
      const score = parseFloat(subjectScores[i].value);

      if (!subject || isNaN(score)) {
        alert("Please fill all subject names and scores correctly.");
        return;
      }

      total += score;
      validCount++;
      outputHTML += `<li class="list-group-item d-flex justify-content-between">
        <span>${subject}</span><span>${score}</span></li>`;
    }

    const avg = total / validCount;
    let grade = '', remark = '';

    if (avg >= 70) { grade = 'A'; remark = 'Excellent (Pass)'; }
    else if (avg >= 60) { grade = 'B'; remark = 'Very Good (Pass)'; }
    else if (avg >= 50) { grade = 'C'; remark = 'Good (Pass)'; }
    else if (avg >= 40) { grade = 'D'; remark = 'Fair (Pass)'; }
    else { grade = 'F'; remark = 'Fail'; }

    outputHTML += `</ul>
      <p><strong>Total Score:</strong> ${total}</p>
      <p><strong>Average Score:</strong> ${avg.toFixed(2)}</p>
      <p><strong>Grade:</strong> ${grade}</p>
      <p><strong>Remark:</strong> <span class="${grade === 'F' ? 'text-danger' : 'text-success'}">${remark}</span></p>`;

    document.getElementById('output').innerHTML = outputHTML;
  }

  async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('studentName').value.trim();
    if (!name) {
      alert("Please enter the student's name.");
      return;
    }

    const subjectNames = document.querySelectorAll('.subject-name');
    const subjectScores = document.querySelectorAll('.subject-score');

    let total = 0;
    let validCount = 0;

    let y = 15;
    doc.setFontSize(14);
    doc.text(`Student Report - ${name}`, 10, y);
    y += 10;

    for (let i = 0; i < subjectNames.length; i++) {
      const subject = subjectNames[i].value.trim();
      const score = parseFloat(subjectScores[i].value);
      if (!subject || isNaN(score)) continue;

      doc.setFontSize(12);
      doc.text(`${subject}: ${score}`, 10, y);
      y += 7;

      total += score;
      validCount++;
    }

    const avg = total / validCount;
    let grade = '', remark = '';

    if (avg >= 70) { grade = 'A'; remark = 'Excellent (Pass)'; }
    else if (avg >= 60) { grade = 'B'; remark = 'Very Good (Pass)'; }
    else if (avg >= 50) { grade = 'C'; remark = 'Good (Pass)'; }
    else if (avg >= 40) { grade = 'D'; remark = 'Fair (Pass)'; }
    else { grade = 'F'; remark = 'Fail'; }

    y += 10;
    doc.text(`Total: ${total}`, 10, y); y += 7;
    doc.text(`Average: ${avg.toFixed(2)}`, 10, y); y += 7;
    doc.text(`Grade: ${grade}`, 10, y); y += 7;
    doc.text(`Remark: ${remark}`, 10, y);

    doc.save(`${name}_Report.pdf`);
  }