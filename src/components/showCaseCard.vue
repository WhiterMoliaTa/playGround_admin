<style scoped>
.step-progress-container {
  position: relative;
  height: 150px;
  margin-top: 20px;
}

.progress-line {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: #ddd;
  z-index: 1;
  border-radius: 3px;
}

/* 主進度條 */
.main-step-progress-bar {
  position: absolute;
  top: 50px;
  left: 8px;
  height: 6px;
  border-radius: 3px;
  z-index: 2;
  transition: width 0.3s ease;
}

/* 次進度條（每兩個節點一段） */
.secondary-step-progress-bar {
  position: absolute;
  height: 6px;
  background-color: #2196f3;
  border-radius: 3px;
  z-index: 2;
}

/* 主節點 */
.main-step-node-circle {
  position: absolute;
  top: 46px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: white;
  border: 3px solid #bbb;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.main-step-node-circle.completed {
  font-size: 10px;
  font-weight: bold;
}

.main-step-checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  pointer-events: none;
}

.main-step-node-label {
  font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
  position: absolute;
  white-space: nowrap;
  font-size: 12px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}

/* 次節點 */
.secondary-step-node-circle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #2196f3;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.secondary-step-node-circle.addition {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #6cbdff;
  border: 2px solid #2196f3;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.secondary-step-node-label {
  font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
  color: #2196f3;
  position: absolute;
  white-space: nowrap;
  font-size: 12px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}

/* 共用 label 樣式 */
.main-step-label-top {
  bottom: 100%;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--line-color);
}

.main-step-label-bottom {
  top: 100%;
  margin-top: 8px;
  border-top: 2px solid var(--line-color);
}

.main-step-label-top {
  bottom: 100%;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--line-color);
}

.main-step-label-bottom {
  top: 100%;
  margin-top: 8px;
  border-top: 2px solid var(--line-color);
}

.main-step-label-top::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 2px;
  height: 8px;
  background-color: var(--line-color, #bbb);
  transform: translateX(-50%);
}

.main-step-label-bottom::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -8px;
  width: 2px;
  height: 8px;
  background-color: var(--line-color, #bbb);
  transform: translateX(-50%);
}

.secondary-step-label-top {
  bottom: auto;
}

.secondary-step-label-bottom {
  top: auto;
}

.secondary-step-label-top.addition {
  border-bottom: 2px solid #2196f3;
}

.secondary-step-label-bottom.addition {
  border-top: 2px solid #2196f3;
}

.secondary-step-label-top.addition::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -48px;
  width: 2px;
  height: 48px;
  background: repeating-linear-gradient(to bottom,
      #2196f3,
      #2196f3 4px,
      transparent 4px,
      transparent 8px);
  transform: translateX(-50%);
}



.secondary-step-label-bottom.addition::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -48px;
  width: 2px;
  height: 48px;
  background: repeating-linear-gradient(to bottom,
      #2196f3,
      #2196f3 4px,
      transparent 4px,
      transparent 8px);
  transform: translateX(-50%);
}
</style>
