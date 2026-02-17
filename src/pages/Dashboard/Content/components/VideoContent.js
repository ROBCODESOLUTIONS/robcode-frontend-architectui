import React, { Component, createRef } from "react";

class VideoContent extends Component {
  videoRef = createRef();

  state = {
    currentQuestionIndex: 0,
    isQuizVisible: false,
    feedbackText: "",
    lockedQuestionTime: null,
  };

  componentWillUnmount() {
    window.clearTimeout(this._nextTimeout);
  }

  getQuestionsFromBody = () => {
    const { content } = this.props;
    const body = content?.body;

    if (!body || typeof body !== "string" || body.trim() === "") return [];

    try {
      const parsed = JSON.parse(body); // parse JSON string -> JS value [web:137]
      if (!Array.isArray(parsed)) return [];

      // sanitize + normalize
      const normalized = parsed
        .filter((q) => q && typeof q === "object")
        .map((q) => ({
          time: Number(q.time),
          question: String(q.question ?? ""),
          options: Array.isArray(q.options) ? q.options.map(String) : [],
          correctIndex: Number(q.correctIndex),
        }))
        .filter(
          (q) =>
            Number.isFinite(q.time) &&
            q.time >= 0 &&
            q.question.trim().length > 0 &&
            q.options.length >= 2 &&
            Number.isInteger(q.correctIndex) &&
            q.correctIndex >= 0 &&
            q.correctIndex < q.options.length
        )
        .sort((a, b) => a.time - b.time);

      return normalized;
    } catch (e) {
      return [];
    }
  };

  handleTimeUpdate = () => {
    const videoEl = this.videoRef.current;
    const { currentQuestionIndex, isQuizVisible, lockedQuestionTime } = this.state;

    const questions = this.getQuestionsFromBody();

    if (!videoEl) return;
    if (isQuizVisible) return;
    if (currentQuestionIndex >= questions.length) return;

    const q = questions[currentQuestionIndex];
    if (lockedQuestionTime === q.time) return;

    if (videoEl.currentTime >= q.time) {
      videoEl.pause();
      this.setState({
        isQuizVisible: true,
        feedbackText: "",
        lockedQuestionTime: q.time,
      });
    }
  };

  handleAnswer = (selectedIndex, e) => {
    if (e) e.stopPropagation();

    const videoEl = this.videoRef.current;
    const { currentQuestionIndex } = this.state;
    const questions = this.getQuestionsFromBody();
    const q = questions[currentQuestionIndex];

    if (!q) return;

    const isCorrect = selectedIndex === q.correctIndex;

    if (!isCorrect) {
      this.setState({ feedbackText: "Incorrecto, intenta nuevamente" });
      return;
    }

    this.setState({ feedbackText: "Correcto" });

    window.clearTimeout(this._nextTimeout);
    this._nextTimeout = window.setTimeout(() => {
      this.setState(
        (prev) => ({
          isQuizVisible: false,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          lockedQuestionTime: null,
          feedbackText: "",
        }),
        () => {
          if (videoEl) videoEl.play();
        }
      );
    }, 700);
  };

  render() {
    const { content } = this.props;
    const { currentQuestionIndex, isQuizVisible, feedbackText } = this.state;

    const questions = this.getQuestionsFromBody();
    const isFinished = currentQuestionIndex >= questions.length;
    const currentQuestion = !isFinished ? questions[currentQuestionIndex] : null;

    const isVideoLocked = isQuizVisible;

    return (
      <div className="content-video p-3">
        <style>{`
          .quizCardWrap{ width: min(560px, calc(100% - 2rem)); z-index: 10; }
          .quizCard{ border-radius: 14px; overflow: hidden; }
          .quizOptionBtn{ text-align: left; }
          .quizShiftUp{ transform: translate(-50%, -60%); }
        `}</style>

        {content?.file ? (
          <div className="position-relative rounded shadow">
            <video
              ref={this.videoRef}
              className="w-100 d-block rounded"
              controls={!isVideoLocked}
              onTimeUpdate={this.handleTimeUpdate}
              style={{ pointerEvents: isVideoLocked ? "none" : "auto" }}
            >
              <source src={content.file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {isQuizVisible && currentQuestion && (
              <div className="quizCardWrap quizShiftUp position-absolute top-50 start-50">
                <div className="card shadow-lg border-0 quizCard" onClick={(e) => e.stopPropagation()}>
                  <div className="card-header bg-white d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary">Quiz</span>
                      <small className="text-muted">
                        Question {currentQuestionIndex + 1} / {questions.length}
                      </small>
                    </div>
                    <small className="text-muted">Video locked</small>
                  </div>

                  <div className="card-body">
                    <h5 className="mb-3">{currentQuestion.question}</h5>

                    <div className="btn-group-vertical w-100" role="group" aria-label="Quiz options">
                      {currentQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          className="btn btn-outline-primary quizOptionBtn"
                          onClick={(e) => this.handleAnswer(i, e)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div
                      className={
                        "mt-3 small fw-semibold " +
                        (feedbackText
                          ? feedbackText.toLowerCase().includes("correct")
                            ? "text-success"
                            : "text-danger"
                          : "text-muted")
                      }
                      style={{ minHeight: 18 }}
                    >
                      {feedbackText || " "}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="alert alert-warning">
            <i className="fas fa-video me-2"></i>
            No hay video disponible
          </div>
        )}
      </div>
    );
  }
}

export default VideoContent;
