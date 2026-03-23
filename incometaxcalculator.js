function val(id){
  return parseFloat(document.getElementById(id).value) || 0;
}

let isPremiumUser = false;
let chart = null;

function formatMoney(x){
  return "Rs. " + Math.round(x).toLocaleString("en-IN")
}

function hraExemption(){
  let basic = val("basic");
  let hra = val("hraReceived");
  let rent = val("rentPaid");
  let city = document.getElementById("city").value;

  if(rent <= 0) return 0;

  let salary = basic; // practical simplification
  let cond1 = hra;
  let cond2 = Math.max(0, rent - (salary * 0.10));
  let cond3 = city === "metro" ? salary * 0.50 : salary * 0.40;

  return Math.min(cond1, cond2, cond3);
}

function calculateOldTax(income){
  income = Math.max(0, income);
  let tax = 0;

  if(income <= 250000) tax = 0;
  else if(income <= 500000) tax = (income - 250000) * 0.05;
  else if(income <= 1000000) tax = 12500 + (income - 500000) * 0.20;
  else tax = 112500 + (income - 1000000) * 0.30;

  if(income <= 500000) tax = 0; // rebate effect simplified

  return tax * 1.04;
}
function connectExpert(){
document.getElementById("leadModal").style.display="flex"
}
function calculateNewTax(income, fy){
  income = Math.max(0, income);
  let tax = 0;

  if(income <= 400000) tax = 0;
  else if(income <= 800000) tax = (income - 400000) * 0.05;
  else if(income <= 1200000) tax = 20000 + (income - 800000) * 0.10;
  else if(income <= 1600000) tax = 60000 + (income - 1200000) * 0.15;
  else if(income <= 2000000) tax = 120000 + (income - 1600000) * 0.20;
  else if(income <= 2400000) tax = 200000 + (income - 2000000) * 0.25;
  else tax = 300000 + (income - 2400000) * 0.30;

  if(fy === "2025" && income <= 700000) tax = 0;
  if(fy === "2026" && income <= 1200000) tax = 0;

  return tax * 1.04;
}

function capitalTax(){
  let stcg = val("stcg");
  let ltcg = val("ltcg");

  let stcgTax = stcg * 0.15;
  let ltcgTax = ltcg > 100000 ? (ltcg - 100000) * 0.10 : 0;

  return (stcgTax + ltcgTax) * 1.04;
}

function suggestions(d80c, nps, oldTax, newTax){
  let s = "";

  if(d80c < 150000){
    s += "💡 Invest " + formatMoney(150000 - d80c) + " more under 80C.<br>";
  }

  if(nps < 50000){
    s += "💡 Use NPS for up to " + formatMoney(50000 - nps) + " extra deduction.<br>";
  }

  s += oldTax < newTax ? "✅ Old Regime saves more tax." : "✅ New Regime saves more tax.";

  return s;
}

function calculate(){
  let fy = document.getElementById("fy").value;
  let hra = hraExemption();

  let basic = val("basic");
  let hraReceived = val("hraReceived");

  let salaryOld = basic + hraReceived - hra;
  let salaryNew = basic + hraReceived;

  let houseIncome = val("house");
  let homeInterest = val("home");
  let business = val("business");
  let other = val("other");

  // old regime house property treatment
  let interestAllowed = Math.min(homeInterest, 200000);
  let housePropertyIncomeOld = houseIncome - interestAllowed;
  if(housePropertyIncomeOld < -200000){
    housePropertyIncomeOld = -200000;
  }

  // new regime: no self-occupied home interest benefit taken here
  let housePropertyIncomeNew = houseIncome;

  let totalOld = salaryOld + housePropertyIncomeOld + business + other;
  let totalNew = salaryNew + housePropertyIncomeNew + business + other;

  let d80c = Math.min(val("d80c"), 150000);
  let d80d = Math.min(val("d80d_self"), 25000) + Math.min(val("d80d_parent"), 50000);
  let nps = Math.min(val("nps"), 50000);

  let deductionsOld = d80c + d80d + nps;
  let taxableOld = Math.max(0, totalOld - deductionsOld - 50000);
  let taxableNew = Math.max(0, totalNew - 75000);

  let oldTax = calculateOldTax(taxableOld);
  let newTax = calculateNewTax(taxableNew, fy);

  let capTax = capitalTax();
  oldTax += capTax;
  newTax += capTax;

  document.getElementById("output").innerHTML = `
    <b>Income Summary</b><br>
    Salary (Old Regime): ${formatMoney(salaryOld)}<br>
    Salary (New Regime): ${formatMoney(salaryNew)}<br>
    House Property (Old): ${formatMoney(housePropertyIncomeOld)}<br>
    House Property (New): ${formatMoney(housePropertyIncomeNew)}<br>
    Total Income (Old): ${formatMoney(totalOld)}<br>
    Total Income (New): ${formatMoney(totalNew)}<br>
    Taxable Income (Old): ${formatMoney(taxableOld)}<br>
    Taxable Income (New): ${formatMoney(taxableNew)}<br>
    Capital Gain Tax: ${formatMoney(capTax)}<br><br>
    <b>Tax Payable</b><br>
    Old Regime Tax: ${formatMoney(oldTax)}<br>
    New Regime Tax: ${formatMoney(newTax)}
  `;

  document.getElementById("recommendation").innerHTML =
    suggestions(d80c, nps, oldTax, newTax);

  if(chart) chart.destroy();
  chart = new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: ["Old Regime", "New Regime"],
      datasets: [{
        label: "Tax Comparison",
        data: [oldTax, newTax]
      }]
    }
  });

  window.taxData = {
    fy,
    salaryOld,
    salaryNew,
    hra,
    houseIncome,
    homeInterest,
    housePropertyIncomeOld,
    housePropertyIncomeNew,
    business,
    other,
    d80c,
    d80d,
    nps,
    totalOld,
    totalNew,
    taxableOld,
    taxableNew,
    oldTax,
    newTax,
    capTax
  };
}

function checkPremium(){

if(!window.taxData){
alert("Please calculate tax first")
return
}

// show popup FIRST
document.getElementById("userModal").style.display="flex"
}

function downloadPDF(){

if(!window.taxData){
alert("Please calculate tax first.");
return;
}

const { jsPDF } = window.jspdf;
const doc = new jsPDF();
const d = window.taxData;
const u = window.userDetails || {};

let y = 20;

// TITLE
doc.setFont("helvetica", "bold")
doc.setFontSize(16);
doc.text("Income Tax Report", 20, y);

// USER DETAILS
y += 10;
doc.setFont("helvetica", "bold")
doc.setFontSize(11);
doc.text("Client Details:", 20, y);

y += 8;
doc.setFont("helvetica", "bold")
doc.setFontSize(10);
doc.text("Name: " + (u.name || "-"), 20, y);
y += 7;
doc.text("Mobile: " + (u.mobile || "-"), 20, y);
y += 7;
doc.text("Email: " + (u.email || "-"), 20, y);

// LINE
y += 5;
doc.line(20, y, 190, y);
y += 10;

// FY
doc.text("Financial Year: " + d.fy, 20, y);

// INCOME
y += 12;
doc.setFont("helvetica", "bold")
doc.setFontSize(12);
doc.text("Income Details", 20, y);

y += 8;
doc.setFont("helvetica", "bold")
doc.setFontSize(10);
doc.text("Salary (Old): " + formatMoney(d.salaryOld), 20, y);
y += 7;
doc.text("Salary (New): " + formatMoney(d.salaryNew), 20, y);
y += 7;
doc.text("HRA Exemption: " + formatMoney(d.hra), 20, y);
y += 7;
doc.text("House Property (Old): " + formatMoney(d.housePropertyIncomeOld), 20, y);
y += 7;
doc.text("House Property (New): " + formatMoney(d.housePropertyIncomeNew), 20, y);
y += 7;
doc.text("Business Income: " + formatMoney(d.business), 20, y);
y += 7;
doc.text("Other Income: " + formatMoney(d.other), 20, y);

// DEDUCTIONS
y += 10;
doc.setFont("helvetica", "bold")
doc.setFontSize(12);
doc.text("Deductions", 20, y);

y += 8;
doc.setFont("helvetica", "bold")
doc.setFontSize(10);
doc.text("80C: " + formatMoney(d.d80c), 20, y);
y += 7;
doc.text("80D: " + formatMoney(d.d80d), 20, y);
y += 7;
doc.text("NPS: " + formatMoney(d.nps), 20, y);
y += 7;
doc.text("Capital Gain Tax: " + formatMoney(d.capTax), 20, y);

// TAX
y += 10;
doc.setFont("helvetica", "bold")
doc.setFontSize(12);
doc.text("Tax Computation", 20, y);

y += 8;
doc.setFont("helvetica", "bold")
doc.setFontSize(10);
doc.text("Total Income (Old): " + formatMoney(d.totalOld), 20, y);
y += 7;
doc.text("Total Income (New): " + formatMoney(d.totalNew), 20, y);
y += 7;
doc.text("Taxable Income (Old): " + formatMoney(d.taxableOld), 20, y);
y += 7;
doc.text("Taxable Income (New): " + formatMoney(d.taxableNew), 20, y);
y += 7;
doc.text("Old Regime Tax: " + formatMoney(d.oldTax), 20, y);
y += 7;
doc.text("New Regime Tax: " + formatMoney(d.newTax), 20, y);

// RECOMMENDATION
y += 12;
doc.setFont("helvetica", "bold")
doc.setFontSize(12);
doc.text(
"Recommendation: " + (d.oldTax < d.newTax ? "Old Regime Better" : "New Regime Better"),
20,
y
);

// DISCLAIMER
y += 12;
doc.setFontSize(9);

let disclaimer = "Disclaimer: This tax computation is based on user inputs and applicable tax laws. It is for informational purposes only. EasyPeasyTax does not guarantee accuracy. Please consult a professional before taking decisions.";

let splitText = doc.splitTextToSize(disclaimer, 170);
doc.text(splitText, 20, y);

// FOOTER
y += splitText.length * 5 + 10;
doc.setFontSize(10);
doc.text("Generated by EasyPeasyTax", 20, y);

// SAVE
doc.save("Tax_Report.pdf");
}

function submitLead(){

let name = document.getElementById("leadName").value.trim()
let mobile = document.getElementById("leadMobile").value.trim()
let email = document.getElementById("leadEmail").value.trim()

// validation
function isValidEmail(email){
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidMobile(mobile){
return /^[6-9]\d{9}$/.test(mobile)
}

if(!name || !mobile || !email){
alert("Please fill all details")
return
}

if(!isValidMobile(mobile)){
alert("Enter valid mobile number")
return
}

if(!isValidEmail(email)){
alert("Enter valid email")
return
}

// close popup
document.getElementById("leadModal").style.display="none"

// create message for YOU
let msg = `🔥 Need Assistance

Name: ${name}
Mobile: ${mobile}
Email: ${email}

Interested in: Tax Saving / Investment Help
`

// send to YOUR WhatsApp
window.open(
"https://wa.me/919149166360?text=" + encodeURIComponent(msg),
"_blank"
)
}
function closeUserModal(){
document.getElementById("userModal").style.display="none"
}

function closeLeadModal(){
document.getElementById("leadModal").style.display="none"
}
window.onclick = function(e){
let userModal = document.getElementById("userModal")
let leadModal = document.getElementById("leadModal")

if(e.target == userModal){
userModal.style.display = "none"
}
if(e.target == leadModal){
leadModal.style.display = "none"
}
}
function submitUserDetails(){

let name = document.getElementById("userName").value.trim()
let mobile = document.getElementById("userMobile").value.trim()
let email = document.getElementById("userEmail").value.trim()

// validation functions
function isValidEmail(email){
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidMobile(mobile){
return /^[6-9]\d{9}$/.test(mobile)
}

// empty check
if(!name || !mobile || !email){
alert("Please fill all details")
return
}

// mobile validation
if(!isValidMobile(mobile)){
alert("Enter valid mobile number (10 digits starting 6-9)")
return
}

// email validation
if(!isValidEmail(email)){
alert("Enter valid email address")
return
}

// store temporarily
window.userDetails = {name, mobile, email}

// close popup
document.getElementById("userModal").style.display="none"

// generate PDF
downloadPDF()

setTimeout(()=>{

let msg = `Hi ${name},

Your tax report is ready.

📎 Please find it attached/downloaded.

If you need help, Contact us.

- EasyPeasyTax`
window.open(
"https://wa.me/91" + mobile + "?text=" + encodeURIComponent(msg),
"_blank"
)
alert("👉 Please attach the downloaded PDF in WhatsApp and send.")

},1000)
}
