import Swal from "sweetalert2";

const Notification = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,

  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default Notification;
