<template>
  <li class="nav-item dropdown">
    <a
      class="nav-link dropdown-toggle"
      href="#"
      id="navbarDropdown"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      投稿
    </a>
    <div class="dropdown-menu photo-form" aria-labelledby="navbarDropdown">
      <Loader v-show="loading">投稿中･･･</Loader>
      <form
        class="form-group my-2 mx-2 my-lg-0"
        v-on:submit.prevent="upload"
        v-show="!loading"
      >
        <div
          class="mb-1 border border-danger rounded text-secondary bg-error"
          v-if="photoFormErrors"
        >
          <ul v-if="photoFormErrors.photo">
            <li v-for="msg in photoFormErrors.photo" :key="msg">{{ msg }}</li>
          </ul>
          <ul v-if="photoFormErrors.comment">
            <li v-for="msg in photoFormErrors.comment" :key="msg">{{ msg }}</li>
          </ul>
        </div>
        <Message />
        <div class="form-group">
          <label>写真を選択</label>
          <input type="file" class="form-control" v-on:change="onFileChange" />
          <output v-if="preview">
            <img class="output py-2" :src="preview" alt="" />
          </output>
        </div>
        <div class="form-group">
          <label for="Textarea1">コメント</label>
          <textarea
            class="form-control"
            id="Textarea1"
            rows="3"
            v-model="comment"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">投稿</button>
      </form>
    </div>
  </li>
</template>

<script>
import Loader from "./Loader";
import Message from "./Message";

export default {
  components: {
    Loader,
    Message,
  },
  data: function () {
    return {
      preview: null,
      photo: null,
      comment: "",
      loading: false,
      photoFormErrors: null,
    };
  },
  methods: {
    onFileChange: function (event) {
      if (event.target.files.length === 0) {
        this.reset();
        return false;
      }

      if (!event.target.files[0].type.match("image.*")) {
        return false;
      }

      //output用
      const reader = new FileReader();

      reader.onload = (e) => {
        this.preview = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);

      //upload用
      this.photo = event.target.files[0];
      // console.log(event.target.files[0].name);
      // console.log(event.target.files[0].type);
      // console.log(event.target.files[0].size);
    },
    upload: async function () {
      if (this.preview === null) {
        alert("ファイルを選択してね！");
        return false;
      }

      if (this.comment === "") {
        this.comment = "no comment";
      }
      //loading components on
      this.loading = true;

      const formData = new FormData();
      formData.append("photo", this.photo);
      formData.append("comment", this.comment);

      const response = await axios
        .post("/api/photo", formData)
        .catch((error) => error.response);

      //loading components off
      this.reset();
      this.loading = false;

      if (response.status === 201) {
        console.log("投稿完了");
        this.$store.commit("utility/setReacquirePhotos", true);
        this.$store.dispatch("message/content", {
          content: "投稿完了！",
          timeout: 6000,
        });
      } else if (response.status === 422) {
        this.photoFormErrors = response.data.errors;
      } else {
        console.log("error!");
        this.$store.commit("error/setAlert", true);
      }
    },
    reset: function () {
      this.preview = null;
      this.photo = null;
      this.comment = "";
      this.$el.querySelector('input[type="file"]').value = null;
    },
  },
};
</script>
