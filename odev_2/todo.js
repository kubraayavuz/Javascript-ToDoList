document.addEventListener("DOMContentLoaded", (event) => {
  // Sayfa yüklendiğinde local storage verilerini yükledim
  loadTasks();

  // Ekle butonuna tıklama olayı
  document.getElementById("liveToastBtn").addEventListener("click", newElement);

  // Enter tuşuna basıldığında yeni görev ekledim
  document.getElementById("task").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      newElement();
    }
  });

  // Var olan görevler için close butonları ekledim
  document.querySelectorAll("ul li").forEach((li) => {
    addCloseButton(li);
    li.onclick = function () {
      this.classList.toggle("checked");
      saveTasks();
    };
  });
});

function newElement() {
  const taskInput = document.getElementById("task"); // Görev girişi
  const taskValue = taskInput.value.trim(); // Girilen görev metni

  // Boş bir görev eklenmeye çalışıldığında hata mesajı gösterdim
  if (taskValue === "") {
    showToast("error");
    return;
  }

  // Yeni görev öğesinin oluşturulması
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(taskValue));

  // Göreve close butonu ekleyen fonksiyonumu çağırdım
  addCloseButton(li);

  // Görevi tamamlandı olarak işaretleme işlevi
  li.onclick = function () {
    this.classList.toggle("checked");
    saveTasks();
  };

  // Yeni görevi listeye ekledim
  document.getElementById("list").appendChild(li);
  taskInput.value = ""; // Giriş kutusunu temizledim

  // Görevin eklendiğine dair başarı mesajı
  showToast("success");
  // Görevleri local storage'a kaydettim
  saveTasks();
}

function addCloseButton(li) {
  // close butonu oluşturdum
  const span = document.createElement("span");
  span.className = "close";
  span.appendChild(document.createTextNode("\u00D7")); // silmek için x karakterini oluşturdum

  // close butonuna tıklandığında görev siliniyor
  span.onclick = function () {
    const li = this.parentElement;
    li.remove();
    saveTasks();
  };

  // close butonunu göreve ekledim
  li.appendChild(span);
}

function showToast(type) {
  // bildirimleri ayarladım (hata mesajı vs.)
  const toastElement = document.querySelector(`.toast.${type}`);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

function saveTasks() {
  // Görevleri localstorage'a kaydettim
  const tasks = [];
  document.querySelectorAll("#list li").forEach((li) => {
    tasks.push({
      text: li.childNodes[0].textContent.trim(),
      checked: li.classList.contains("checked"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  // local storage'taki görevleri yükledim
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(task.text));

    // Görev yapıldıysa onu işaretledim
    if (task.checked) {
      li.classList.add("checked");
    }

    // Göreve close butonu ekledim
    addCloseButton(li);
    li.onclick = function () {
      this.classList.toggle("checked");
      saveTasks();
    };

    // Görevi listeye ekledim
    document.getElementById("list").appendChild(li);
  });
}
