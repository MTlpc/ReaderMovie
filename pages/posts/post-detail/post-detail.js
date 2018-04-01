var postsData = require('../../data/post-data.js');
var app = getApp();

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.setData({ currentPostId: postId });
    var postData = postsData.postList[postId];
    this.setData({ postData: postData })

    // 判断页面收藏逻辑
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }

    if (app.gloableData.g_isPlayingMusic && app.gloableData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic: true
      })
    }

    this.setMusicMonitor();
    
  },

  setMusicMonitor: function(){
    // 监听音乐播放或暂停
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.gloableData.g_isPlayingMusic=true;
      app.gloableData.g_currentMusicPostId = that.data.currentPostId;
    });

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.gloableData.g_isPlayingMusic=false;
      app.gloableData.g_currentMusicPostId = null;
    })
  },

  // 收藏页面逻辑
  onColletionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;

    wx.setStorageSync('posts_collected', postsCollected)

    this.setData({
      collected: postCollected
    });

    wx.showToast({
      title: postCollected ? "收藏成功" : "已取消",
      duration: 1000
    })
  },

  onShareTap: function () {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享给QQ好友",
      "分享到新浪微博"]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        // res.cancel 是否取消
        // res.tapIndex 数组元素的序号
      }
    })
  },

  // 音乐功能
  onMusicTap: function (event) {
    var postId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[postId].music.url,
        title: postsData.postList[postId].music.title,
        coverImgUrl: postsData.postList[postId].music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }
  }
})