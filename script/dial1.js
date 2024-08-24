const canvascpu = document.querySelector('.cpu-gauge-numbers');
const ctxcpu = canvascpu.getContext('2d');
const canvasgpu = document.querySelector('.gpu-gauge-numbers');
const ctxgpu = canvasgpu.getContext('2d');
const canvasram = document.querySelector('.ram-gauge-numbers');
const ctxram = canvasram.getContext('2d');
ctxram.font = '15px "Roboto Mono"';
ctxcpu.font = '15px "Roboto Mono"';
ctxgpu.font = '15px "Roboto Mono"';
const centerX = 175;
const centerY = 175;
const bigCenterX = 250;
const bigCenterY = 250;
var cpuBuffer=[];
var gpuBuffer=[];
var ramBuffer=[];
var gpuSpeed=0;
var cpuSpeed=0;
var ramUsage=0;
var currentGpuSpeed=0;
var currentCpuSpeed=0;
var currentRamUsage=0;
var speedIncrement=0.5;
var maxRam = 8;
const smallRadius = 125;
const bigRadius = 200;

function animateNeedle(speed, canvas) {
    if(canvas === 'gpu'){
        const needle = document.querySelector('.gpu-gauge-needle');
        const maxRotation = 135; // Needle rotation in degrees
        const initialRotation = -135;
        const rotation = initialRotation + ((speed/100) * maxRotation);
        needle.style.transform = `rotateZ(${rotation}deg)`;
    } else if(canvas === 'cpu'){
        const needle = document.querySelector('.cpu-gauge-needle');
        const maxRotation = 270; // Needle rotation in degrees
        const initialRotation = -135;
        const rotation = initialRotation + ((speed/100) * maxRotation);
        needle.style.transform = `rotateZ(${rotation}deg)`;
    } else if(canvas === 'ram'){
        const needle = document.querySelector('.ram-gauge-needle');
        const maxRotation = -135; // Needle rotation in degrees
        const initialRotation = 135;
        const rotation = initialRotation + ((speed/maxRam) * maxRotation);
        needle.style.transform = `rotateZ(${rotation}deg)`;
    }
}

function animateGpuGauge() {
    var diff = gpuSpeed - currentGpuSpeed;
    if (Math.abs(diff) > 0.2) {
        if (currentGpuSpeed < 0) {
            currentGpuSpeed = 0;
        } else {
            currentGpuSpeed += (diff > 0 ? speedIncrement : -speedIncrement);
            requestAnimationFrame(animateGpuGauge);
        }
    } else {
        currentGpuSpeed = gpuSpeed;
    }
    animateNeedle(currentGpuSpeed, "gpu");
    document.getElementById("gpu-gauge-text").innerText = gpuSpeed.toFixed(1) + "%";
    document.getElementById("gpu-id-text").innerText = gpuName;
}

function animateCpuGauge() {
    var diff = cpuSpeed - currentCpuSpeed;
    if (Math.abs(diff) > 0.2) {
        if (currentCpuSpeed < 0) {
            currentCpuSpeed = 0;
        } else {
            currentCpuSpeed += (diff > 0 ? speedIncrement : -speedIncrement);
            requestAnimationFrame(animateCpuGauge);
        }
    } else {
        currentCpuSpeed = cpuSpeed;
    }
    animateNeedle(currentCpuSpeed, "cpu");
    document.getElementById("cpu-gauge-text").innerText = cpuSpeed.toFixed(1) + "%";
    document.getElementById("cpu-id-text").innerText = cpuName;
}

function animateRamGauge() {
    var diff = ramUsage - currentRamUsage;
    var increment = speedIncrement / 100 * maxRam;
    if (Math.abs(diff) > 0.2) {
        currentRamUsage += (diff > 0 ? increment : -increment);
        requestAnimationFrame(animateRamGauge);
    } else {
        currentRamUsage = ramUsage;
    }
    animateNeedle(currentRamUsage, 'ram');
    document.getElementById("ram-gauge-text").innerText = ramUsage.toFixed(1) + "GB";
    document.getElementById("ram-id-text").innerText = ramUsage;
}

function drawMeasurements(canvas){
    if(canvas === 'gpu'){
        const startAngle = -Math.PI * 5 / 4;
        const maxAngle = (Math.PI * 3 / 4);
        const measurementRadius = smallRadius - 20;
        const interval = 20;
        ctxgpu.textAlign = 'center';
        ctxgpu.textBaseline = 'middle';
        ctxgpu.font = '15px "Roboto Mono"';
        ctxgpu.clearRect(0, 0, canvasgpu.width, canvasgpu.height);

        for (let i = 0; i <= 100; i += interval) {
            const angle = startAngle + (i / 100) * maxAngle;
            const x = centerX + measurementRadius * Math.cos(angle);
            const y = centerY + measurementRadius * Math.sin(angle);
            ctxgpu.fillStyle = i<85? '#b7b7b7' : '#ff2525';
            ctxgpu.fillText(i.toString(), x, y);
        }
    } else if(canvas === 'cpu'){
        const startAngle = -Math.PI * 5 / 4;
        const maxAngle = (Math.PI * 3 / 2);
        const measurementRadius = bigRadius - 25;
        const interval = 10;
        ctxcpu.textAlign = 'center';
        ctxcpu.textBaseline = 'middle';
        ctxcpu.font = '20px "Roboto Mono"';
        ctxcpu.clearRect(0, 0, canvascpu.width, canvascpu.height);

        for (let i = 0; i <= 100; i += interval) {
            const angle = startAngle + (i / 100) * maxAngle;
            const x = bigCenterX + measurementRadius * Math.cos(angle);
            const y = bigCenterY + measurementRadius * Math.sin(angle);
            ctxcpu.fillStyle = i<85? '#b7b7b7' : '#ff2525';
            ctxcpu.fillText(i.toString(), x, y);
        }
    } else if(canvas === 'ram'){
        const startAngle = (Math.PI*9/4)
        const maxAngle = -(Math.PI * 3 / 4);
        const measurementRadius = smallRadius - 20;
        const interval = maxRam/4;
        ctxram.textAlign = 'center';
        ctxram.textBaseline = 'middle';
        ctxram.font = '15px "Roboto Mono"';
        ctxram.clearRect(0, 0, canvasram.width, canvasram.height);

        for (let i = 0; i <= maxRam; i += interval) {
            const angle = startAngle + (i / maxRam) * maxAngle;
            const x = centerX + measurementRadius * Math.cos(angle);
            const y = centerY + measurementRadius * Math.sin(angle);
            ctxram.fillStyle = i<0.85*maxRam? '#b7b7b7' : '#ff2525';
            ctxram.fillText(i.toString(), x, y);
    }
    }
}
function livelyPropertyListener(name, val)
{
  switch(name){
    case 'dialSelect':
        if(val == 0){
            window.location.href="dial0.html";
        }
        break;
  }
}

function livelySystemInformation(data) {
    var obj = JSON.parse(data);
    var cpu = obj.CurrentCpu;
    var gpu = obj.CurrentGpu3D;
    cpu = parseFloat(parseFloat(cpu).toFixed(1));
    gpu = parseFloat(parseFloat(gpu).toFixed(1));
    maxRam = obj.TotalRam/1024;
    drawMeasurements('ram')
    var ram = (obj.TotalRam-obj.CurrentRamAvail)/1024;
    cpuName = extractCpuModel(obj.NameCpu);
    gpuName = extractGpuModel(obj.NameGpu);
    updateval(cpu, gpu, ram);
}

function updateval(cpu, gpu, ram) {
    gpuBuffer.push(gpu);
    if (gpuBuffer.length > 5) {
        gpuBuffer.shift();
    }
    gpuSpeed = gpuBuffer.reduce((sum, val) => sum + val, 0) / gpuBuffer.length;
    cpuBuffer.push(cpu);
    if (cpuBuffer.length > 5) {
        cpuBuffer.shift();
    }
    cpuSpeed = cpuBuffer.reduce((sum, val) => sum + val, 0) / cpuBuffer.length;
    ramBuffer.push(ram);
    if (ramBuffer.length > 5) {
        ramBuffer.shift();
    }
    ramUsage = ramBuffer.reduce((sum, val) => sum + val, 0) / ramBuffer.length;
}

function extractCpuModel(cpuString) {
    if (/Intel/.test(cpuString)) {
        const intelRegex = /Core\(TM\)\s+(\w+-\w+)/;
        const match = cpuString.match(intelRegex);
        return match ? match[1] : null;
    }
    if (/AMD/.test(cpuString)) {
        const amdRegex = /AMD\s+(Ryzen\s+\d+\s+\d+)/;
        const match = cpuString.match(amdRegex);
        return match ? match[1] : null;
    }
    return "unknown";
}

function extractGpuModel(gpuString) {
    if (/NVIDIA/.test(gpuString)) {
        const nvidiaRegex = /GeForce\s+(RTX\s+\d{4}\s?\w*|GTX\s+\d{4}\s?\w*)/i;
        const match = gpuString.match(nvidiaRegex);
        return match ? match[1] : null;
    }
    if (/AMD/.test(gpuString)) {
        const amdRegex = /Radeon\s+(RX\s+\d{4}\s?\w*)/i;
        const match = gpuString.match(amdRegex);
        return match ? match[1] : null;
    }
    if (/Intel/.test(gpuString)) {
        const intelRegex = /Intel\(R\)\s+(UHD|Iris\s+Xe)\s+Graphics/i;
        const match = gpuString.match(intelRegex);
        return match ? `Intel ${match[1]} Graphics` : null;
    }
    return "Unknown";
}

setTimeout(()=>{
    drawMeasurements('gpu');
    drawMeasurements('cpu');
    drawMeasurements('ram');
},500);

setInterval(()=>{
    animateCpuGauge();
    animateGpuGauge();
    animateRamGauge();
},2000);

