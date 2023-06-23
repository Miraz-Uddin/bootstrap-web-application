function getTableRows(foundData) {
  let rows = "";
  for (let i of foundData) {
    const { id, email, body } = i;
    const str = `
      <tr>
        <td style="width:10%">${id}</td>
        <td style="width:20%">${
          email
            .replace(/[\s~`!#$%^&*()_+\-={[}\]|\\:;"'<,>.?/]+/g, " ")
            .split("@")?.[0]
        }</td>
        <td style="width:60%" >${body}</td>
        <td style="width:10%"><button id=${id} type="button" class="btn btn-outline-info">View</button></td>
      </tr>
      `;
    rows += str;
  }
  return rows;
}

function paginatedData(linkHeader, currentPage = "1") {
  const linkHeaderArr = linkHeader.split(",");
  let links = "";
  let prevLink = "";
  let firstPageLink = "";
  let firstLink = "";
  let lastLink = "";
  let nextLink = "";
  let firstPage = "1";
  let lastPage = "";

  // Creating Edge Anchors
  for (let i of linkHeaderArr) {
    const abstractLink1 = i.split(";")?.[0].trim();
    const abstractLink2 = i.split(";")?.[1].trim().split("=")[1] || "";
    const navigationLink = abstractLink1.substring(1, abstractLink1.length - 1);
    const linkName = abstractLink2.substring(1, abstractLink2.length - 1);
    const url = new URL(navigationLink);
    const isLinkActive =
      currentPage === url.searchParams.get("_page") ? "active" : "";
    if (linkName === "prev") {
      prevLink = createLink(navigationLink, "&laquo;", "");
    }
    if (linkName === "first") {
      firstPageLink = navigationLink;
      firstLink = createLink(navigationLink, "Go to First Page", "");
    }
    if (linkName === "last") {
      lastPage = url.searchParams.get("_page");
      lastLink = createLink(navigationLink, "Go to Last Page", "");
    }
    if (linkName === "next") {
      nextLink = createLink(navigationLink, "&raquo;", "");
    }
  }

  // Creating Inbetween Anchors
  let inbetweenLinks = "";
  for (let i = Number(firstPage); i < lastPage; i++) {
    if (lastPage > 5) {
      let [page1, page2, page3, page4, page5] = ["", "", ""];
      if (Number(currentPage) === 1) {
        page3 = createPageLink(firstPageLink, Number(currentPage), "active");
        if (Number(currentPage) < lastPage - 1) {
          page4 = createPageLink(firstPageLink, Number(currentPage) + 1, "");
          page5 = createPageLink(firstPageLink, Number(currentPage) + 2, "");
        }
        if (Number(currentPage) === lastPage - 1) {
          page4 = createPageLink(firstPageLink, Number(currentPage) + 1, "");
        }
      }
      if (Number(currentPage) === 2) {
        page2 = createPageLink(firstPageLink, Number(currentPage) - 1, "");
        page3 = createPageLink(firstPageLink, Number(currentPage), "active");
        if (Number(currentPage) < lastPage - 1) {
          page4 = createPageLink(firstPageLink, Number(currentPage) + 1, "");
          page5 = createPageLink(firstPageLink, Number(currentPage) + 2, "");
        }
        if (Number(currentPage) === lastPage - 1) {
          page4 = createPageLink(firstPageLink, Number(currentPage) + 1, "");
        }
      }
      if (Number(currentPage) > 2) {
        page1 = createPageLink(firstPageLink, Number(currentPage) - 2, "");
        page2 = createPageLink(firstPageLink, Number(currentPage) - 1, "");
        page3 = createPageLink(firstPageLink, Number(currentPage), "active");
        if (Number(currentPage) < lastPage - 1) {
          page4 = createPageLink(firstPageLink, Number(currentPage) + 1, "");
          page5 = createPageLink(firstPageLink, Number(currentPage) + 2, "");
        }
        if (Number(currentPage) === lastPage - 1) {
          page4 = createPageLink(firstPageLink, Number(currentPage) + 1, "");
        }
      }

      inbetweenLinks =
        (page1 || "") +
        (page2 || "") +
        (page3 || "") +
        (page4 || "") +
        (page5 || "");
      break;
    }
    inbetweenLinks += createPageLink(firstPageLink, i, "");
  }

  return (
    firstLink +
    (prevLink || createLink("javascript:void(0)", "&laquo;", "disabled")) +
    inbetweenLinks +
    (nextLink || createLink("javascript:void(0)", "&raquo;", "disabled")) +
    lastLink
  );
}

function createLink(link, title, state = "") {
  return `<li class="page-item ${state}"><span onclick="clickButton(this)" class="page-link" data-ref=${link}>${title}</span></li>`;
}

function createPageLink(link, title, state = "") {
  const page = `https://jsonplaceholder.typicode.com/comments?_page=${title}&_limit=7`;
  return `<li class="page-item ${state}"><span onclick="clickButton(this)" class="page-link" data-ref=${page}>${title}</span></li>`;
}

async function getAPIData(currentPage = "1", limit = "7") {
  let linkHeader = "";
  let foundData = "";
  var apiUrl = `https://jsonplaceholder.typicode.com/comments?_page=${currentPage}&_limit=${limit}`;
  await fetch(apiUrl)
    .then((response) => {
      linkHeader = response.headers.get("link");
      return response.json();
    })
    .then((data) => {
      foundData = data;
    })
    .catch((err) => {
      console.log(err);
    });
  document.querySelector("#testimonial_pagination").innerHTML = paginatedData(
    linkHeader,
    currentPage
  );
  document.querySelector("#testimonial_data").innerHTML =
    getTableRows(foundData);
  return { linkHeader, foundData };
}

async function clickButton(el) {
  const url = new URL(el.dataset.ref);
  const pageNumber = url.searchParams.get("_page");
  await getAPIData(pageNumber);
}

(async () => {
  await getAPIData("1");
})();
