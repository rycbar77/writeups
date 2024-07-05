# 0ob

> CVE-2024-0517

方法有些过于理想化，使用%OptimizeMaglevOnNextCall的方式可以稳定利用，但是使用循环触发优化之后的内存布局十分不稳定，gc过程中非常容易crash，成功概率较低，需要多次尝试。

## reference

https://issues.chromium.org/issues/41488920

https://cwresearchlab.co.kr/entry/CVE-2024-0517-Out-of-Bounds-Write-in-V8
