/* =========================
   FINNOTE JAVASCRIPT
========================= */


/* =========================
   DATA TRANSAKSI
========================= */

let transactions = JSON.parse(
    localStorage.getItem("finnoteTransactions")
) || [];

let currentFilter = "all";


/* =========================
   ELEMENT
========================= */

const transactionForm =
    document.getElementById("transactionForm");

const transactionTable =
    document.getElementById("transactionTable");

const emptyTransaction =
    document.getElementById("emptyTransaction");

const searchTransaction =
    document.getElementById("searchTransaction");


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);

}


/* =========================
   SIMPAN DATA
========================= */

function saveTransactions() {

    localStorage.setItem(
        "finnoteTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================
   TAMBAH TRANSAKSI
========================= */

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const type =
                document.getElementById(
                    "transactionType"
                ).value;


            const name =
                document.getElementById(
                    "transactionName"
                ).value.trim();


            const amount =
                Number(
                    document.getElementById(
                        "transactionAmount"
                    ).value
                );


            const date =
                document.getElementById(
                    "transactionDate"
                ).value;


            if (!type || !name || !amount || !date) {

                alert(
                    "Silakan lengkapi semua data transaksi."
                );

                return;

            }


            const transaction = {

                id: Date.now(),

                type: type,

                name: name,

                amount: amount,

                date: date

            };


            transactions.unshift(transaction);


            saveTransactions();


            transactionForm.reset();


            updateWebsite();

        }
    );

}


/* =========================
   HAPUS TRANSAKSI
========================= */

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Yakin ingin menghapus transaksi ini?"
        );


    if (!confirmDelete) {
        return;
    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();


    updateWebsite();

}


/* =========================
   TAMPILKAN TRANSAKSI
========================= */

function displayTransactions() {

    if (!transactionTable) {
        return;
    }


    const keyword =
        searchTransaction
            ? searchTransaction.value
                .toLowerCase()
            : "";


    let filtered =
        transactions.filter(
            transaction => {

                const matchFilter =
                    currentFilter === "all" ||
                    transaction.type === currentFilter;


                const matchSearch =
                    transaction.name
                        .toLowerCase()
                        .includes(keyword);


                return matchFilter && matchSearch;

            }
        );


    transactionTable.innerHTML = "";


    if (filtered.length === 0) {

        emptyTransaction.style.display =
            "block";

        return;

    }


    emptyTransaction.style.display =
        "none";


    filtered.forEach(
        transaction => {

            const row =
                document.createElement("tr");


            const formattedDate =
                new Date(
                    transaction.date +
                    "T00:00:00"
                ).toLocaleDateString(
                    "id-ID",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const typeText =
                transaction.type === "income"
                    ? "Pemasukan"
                    : "Pengeluaran";


            const amountClass =
                transaction.type === "income"
                    ? "amount-income"
                    : "amount-expense";


            const typeClass =
                transaction.type === "income"
                    ? "type-income"
                    : "type-expense";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            row.innerHTML = `

                <td>
                    ${formattedDate}
                </td>

                <td>
                    ${escapeHTML(transaction.name)}
                </td>

                <td>
                    <span class="${typeClass}">
                        ${typeText}
                    </span>
                </td>

                <td>
                    <span class="${amountClass}">
                        ${sign}
                        ${formatRupiah(transaction.amount)}
                    </span>
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})">

                        Hapus

                    </button>

                </td>

            `;


            transactionTable.appendChild(row);

        }
    );

}


/* =========================
   FILTER
========================= */

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".filter-btn")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                this.classList.add("active");


                currentFilter =
                    this.dataset.filter;


                displayTransactions();

            }
        );

    });


/* =========================
   SEARCH
========================= */

if (searchTransaction) {

    searchTransaction.addEventListener(
        "input",
        function () {

            displayTransactions();

        }
    );

}


/* =========================
   HITUNG KEUANGAN
========================= */

function calculateFinance() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            } else {

                expense +=
                    transaction.amount;

            }

        }
    );


    const balance =
        income - expense;


    return {
        income,
        expense,
        balance
    };

}


/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard() {

    const finance =
        calculateFinance();


    const totalIncome =
        document.getElementById(
            "totalIncome"
        );

    const totalExpense =
        document.getElementById(
            "totalExpense"
        );

    const totalBalance =
        document.getElementById(
            "totalBalance"
        );


    if (totalIncome) {

        totalIncome.textContent =
            formatRupiah(finance.income);

    }


    if (totalExpense) {

        totalExpense.textContent =
            formatRupiah(finance.expense);

    }


    if (totalBalance) {

        totalBalance.textContent =
            formatRupiah(finance.balance);

    }


    const heroBalance =
        document.getElementById(
            "heroBalance"
        );

    const heroIncome =
        document.getElementById(
            "heroIncome"
        );

    const heroExpense =
        document.getElementById(
            "heroExpense"
        );


    if (heroBalance) {

        heroBalance.textContent =
            formatRupiah(finance.balance);

    }


    if (heroIncome) {

        heroIncome.textContent =
            formatRupiah(finance.income);

    }


    if (heroExpense) {

        heroExpense.textContent =
            formatRupiah(finance.expense);

    }


    const statIncome =
        document.getElementById(
            "statIncome"
        );

    const statExpense =
        document.getElementById(
            "statExpense"
        );

    const statBalance =
        document.getElementById(
            "statBalance"
        );


    if (statIncome) {

        statIncome.textContent =
            formatRupiah(finance.income);

    }


    if (statExpense) {

        statExpense.textContent =
            formatRupiah(finance.expense);

    }


    if (statBalance) {

        statBalance.textContent =
            formatRupiah(finance.balance);

    }


    updateInsight(finance);

    updateRecentTransactions();

    updateChart(finance);

}


/* =========================
   FINANCIAL INSIGHT
========================= */

function updateInsight(finance) {

    const insight =
        document.getElementById(
            "financialInsight"
        );


    if (!insight) {
        return;
    }


    if (transactions.length === 0) {

        insight.textContent =
            "Belum ada transaksi. Yuk mulai catat keuanganmu!";

        return;

    }


    if (
        finance.income === 0 &&
        finance.expense > 0
    ) {

        insight.textContent =
            "Saat ini kamu memiliki pengeluaran tanpa pemasukan yang tercatat. Yuk mulai catat pemasukanmu juga.";

        return;

    }


    if (
        finance.balance < 0
    ) {

        insight.textContent =
            "Pengeluaranmu lebih besar daripada pemasukan. Coba evaluasi kembali pengeluaran yang bisa dikurangi.";

        return;

    }


    if (
        finance.income > 0 &&
        finance.expense >
        finance.income * 0.7
    ) {

        insight.textContent =
            "Pengeluaranmu sudah cukup besar dibandingkan pemasukan. Coba sisihkan lebih banyak untuk tabungan.";

        return;

    }


    if (
        finance.balance > 0
    ) {

        insight.textContent =
            "Bagus! Kondisi keuanganmu masih positif. Pertahankan kebiasaan mencatat dan jangan lupa menabung.";

        return;

    }


    insight.textContent =
        "Terus pantau transaksi keuanganmu agar lebih mudah mengatur pengeluaran.";

}


/* =========================
   TRANSAKSI TERAKHIR
========================= */

function updateRecentTransactions() {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    if (!container) {
        return;
    }


    if (transactions.length === 0) {

        container.innerHTML = `
            <p class="empty-text">
                Belum ada transaksi.
            </p>
        `;

        return;

    }


    const recent =
        transactions.slice(0, 4);


    container.innerHTML = "";


    recent.forEach(
        transaction => {

            const item =
                document.createElement("div");


            item.style.display = "flex";
            item.style.justifyContent =
                "space-between";
            item.style.alignItems =
                "center";
            item.style.padding =
                "10px 0";
            item.style.borderBottom =
                "1px solid #f8e8ed";


            const color =
                transaction.type === "income"
                    ? "#4c9b66"
                    : "#d56875";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            item.innerHTML = `

                <div>

                    <strong
                        style="
                        display:block;
                        font-size:11px;
                        color:#5c4a50;
                        ">

                        ${escapeHTML(
                            transaction.name
                        )}

                    </strong>

                    <small
                        style="
                        color:#9b878e;
                        font-size:9px;
                        ">

                        ${transaction.type === "income"
                            ? "Pemasukan"
                            : "Pengeluaran"}

                    </small>

                </div>


                <strong
                    style="
                    color:${color};
                    font-size:10px;
                    ">

                    ${sign}
                    ${formatRupiah(
                        transaction.amount
                    )}

                </strong>

            `;


            container.appendChild(item);

        }
    );

}


/* =========================
   CHART
========================= */

function updateChart(finance) {

    const chart =
        document.getElementById(
            "barChart"
        );


    if (!chart) {
        return;
    }


    const maxValue =
        Math.max(
            finance.income,
            finance.expense,
            1
        );


    const incomeHeight =
        Math.max(
            8,
            (finance.income /
                maxValue) * 190
        );


    const expenseHeight =
        Math.max(
            8,
            (finance.expense /
                maxValue) * 190
        );


    chart.innerHTML = `

        <div class="bar-group">

            <div class="bar-value">
                ${formatRupiah(finance.income)}
            </div>

            <div
                class="bar income-bar"
                style="height:${incomeHeight}px">
            </div>

            <div class="bar-label">
                Pemasukan
            </div>

        </div>


        <div class="bar-group">

            <div class="bar-value">
                ${formatRupiah(finance.expense)}
            </div>

            <div
                class="bar expense-bar"
                style="height:${expenseHeight}px">
            </div>

            <div class="bar-label">
                Pengeluaran
            </div>

        </div>

    `;

}


/* =========================
   MODAL TIPS
========================= */

function openTip(title, text) {

    const modal =
        document.getElementById(
            "tipModal"
        );

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );

    const modalText =
        document.getElementById(
            "modalText"
        );


    modalTitle.textContent =
        title;


    modalText.textContent =
        text;


    modal.classList.add("show");

}


function closeTip() {

    const modal =
        document.getElementById(
            "tipModal"
        );


    modal.classList.remove("show");

}


window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "tipModal"
            );


        if (
            event.target === modal
        ) {

            closeTip();

        }

    }
);


/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

    const nav =
        document.getElementById(
            "navMenu"
        );


    nav.classList.toggle("show");

}


/* =========================
   NAVBAR ACTIVE
========================= */

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".nav-link"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                this.classList.add(
                    "active"
                );


                const nav =
                    document.getElementById(
                        "navMenu"
                    );


                nav.classList.remove(
                    "show"
                );

            }
        );

    });


/* =========================
   DEFAULT DATE
========================= */

const dateInput =
    document.getElementById(
        "transactionDate"
    );


if (dateInput) {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================
   UPDATE SEMUA
========================= */

function updateWebsite() {

    displayTransactions();

    updateDashboard();

}


/* =========================
   START WEBSITE
========================= */

updateWebsite();