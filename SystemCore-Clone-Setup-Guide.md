# SystemCore Clone Bench — Setup Guide (Team 5675)

**Purpose:** Build a Raspberry Pi 5 stand-in for the SystemCore control system so we can validate our `SYSTEMCORE-2027:` migration seams *before* the 2027 season starts, instead of discovering them during build season.

**Status of this document:** Written August 2026, revised **3 September 2026**. Everything here depends on pre-release software (SystemCore OS **beta** + WPILib **2027 alpha**). Expect details to shift. This guide is a map, not gospel — the Bobcat Robotics repo is the authoritative source and should be re-checked before each attempt.

> **What changed in the 3 Sep 2026 revision:** WPILib moved to alpha 7 and SystemCore to image 14, which broke every vendor library at once. §4.1 is new and is the most important section in this document — read it before you upgrade anything. §16 is a new findings log.

**Primary source:** FRC Team 177 (Bobcat Robotics), *SystemCore Clone Guide v1.0*
- Repo: https://github.com/BobcatRobotics/SystemCore-Clone
- Chief Delphi post: https://www.chiefdelphi.com/t/team-177-429-bobcat-robotics-program-2026-2027-build-thread/522511/16

---

## Table of Contents

1. [Why 5675 is building this](#1-why-5675-is-building-this)
2. [Background for beginners](#2-background-for-beginners)
3. [Hardware we purchased](#3-hardware-we-purchased)
4. [Software you need to download](#4-software-you-need-to-download)
   - [4.1 Version pinning — read before upgrading anything](#41-version-pinning--read-before-upgrading-anything)
5. [Physical assembly](#5-physical-assembly)
6. [Path A — Prebuilt Bobcat image (recommended first attempt)](#6-path-a--prebuilt-bobcat-image-recommended-first-attempt)
7. [Path B — Build from the base image (fallback / learning path)](#7-path-b--build-from-the-base-image-fallback--learning-path)
8. [Installing the CANivore drivers](#8-installing-the-canivore-drivers)
9. [Verification — how you know it worked](#9-verification--how-you-know-it-worked)
10. [Wiring a real CTRE device to the bench](#10-wiring-a-real-ctre-device-to-the-bench)
11. [Deploying and running test code](#11-deploying-and-running-test-code)
12. [What this bench validates for our codebase](#12-what-this-bench-validates-for-our-codebase)
13. [Known gotchas and troubleshooting](#13-known-gotchas-and-troubleshooting)
14. [Safety notes](#14-safety-notes)
15. [Open questions and next steps](#15-open-questions-and-next-steps)
16. [Findings log](#16-findings-log)

---

## 1. Why 5675 is building this

FRC is replacing the roboRIO with **SystemCore** for the 2027 season. That's the biggest control-system change in FRC history, and it lands the same season our 2027 baseline codebase targets.

Our baseline is written against the current stable 2026 toolchain so it compiles and drives on the practice bot *today*. Everywhere the migration will require a change, we left a greppable marker:

```
SYSTEMCORE-2027:
```

Right now those comments describe what we **believe** will change. This bench is how we find out whether we're right, using real 2027 alpha tooling, without needing SystemCore hardware that isn't purchasable yet.

**The three questions we most need answered:**

| Priority | Question | Why it matters to us |
|---|---|---|
| 1 | **Commands v2 vs. v3** | Our entire 10-exercise teaching ladder is written v2-style. If v3 is the 2027 default, that's a teaching-guide rewrite, not a code seam — and rewrites take longer than code fixes. |
| 2 | Does our **WPILOG Analyzer** still parse a 2027-generated `.wpilog`? | The analyzer parses the WPILOG binary format by hand. A format version bump, new record types, or changed struct encoding breaks our entire post-match workflow. Cheap to test, high consequence. |
| 3 | Does the **Phoenix 6 swerve generator** output change shape? | Our whole drivetrain is generator-shaped. If `TunerConstants` changes, both `TunerConstants` and `TunerConstantsPractice` change. |
| 4 | ~~Does **AdvantageKit** have a working 2027 alpha path?~~ | **Answered 3 Sep 2026 — see §16-F.** Yes, but it is pinned a full WPILib alpha and three SystemCore images behind current. You can have AdvantageKit *or* current WPILib/SystemCore, not both. Still lower priority; see the note below. |

### A note on AdvantageKit vs. our own logging stack

**WPILOG is a WPILib format, not an AdvantageKit format.** WPILib's built-in `DataLogManager` writes `.wpilog` files with no third-party dependency, and our Unified WPILOG Analyzer reads that binary format directly. AdvantageKit is doing three separate jobs in the baseline:

| Job | Requires AdvantageKit? | Fallback |
|---|---|---|
| Write `.wpilog` files for post-match analysis | No | `DataLogManager` (WPILib core) |
| Publish live telemetry to the dashboard | No | NT4 struct publishers → Elastic |
| Deterministic replay through the IO layers | **Yes** | None |

So if AdvantageKit lags the 2027 alpha, we lose **replay** and we gain some duplicated call sites — we do *not* lose logging or the dashboard. That's a real cost but a survivable one.

**The consequence worth deciding on:** the IO-layer structure in the baseline exists specifically to enable replay. If replay is unavailable for 2027, those layers become an abstraction beginners have to learn that buys them nothing, and we should simplify rather than teach ceremony. Don't make that call until the bench gives an answer.

**Update, 3 Sep 2026 — the IO-layer question now has enough evidence to act on.** AdvantageKit's 2027 port is alive and actively maintained (four of its seven published known-issues are already struck through as fixed), but two things push replay out of reach for this season's prep:

- Its releases pin to a **specific** WPILib alpha *and* a specific SystemCore image. v27.0.0-alpha-4 targets WPILib alpha-6 and SystemCore image 11 — one WPILib alpha and three OS images behind current.
- **Only the skeleton template project exists for 2027.** The TalonFX-swerve template — the published reference for wrapping IO layers around a CTRE swerve, and the thing we'd point students at — has not shipped.

**Decision:** keep the IO seam in the drivetrain (it's one interface and it's cheap), but do **not** build the exercise ladder around IO layers. Teaching beginners an abstraction whose payoff hasn't shipped is exactly the ceremony problem flagged above. Revisit after kickoff.

Team 177's example project ships **both** a Commands v2 and a Commands v3 version — deploy both and compare. That comparison is the most valuable single thing on this bench.

**Second reference point for v3 style:** [FRC 5712 "Gray Matter" Coding Workshop](https://www.frc5712.com/) is built specifically around Commands v3 (their own description: "the new coding paradigms for 2027"), on the same CTRE + Limelight + PathPlanner stack this baseline uses — genuinely well-regarded on Chief Delphi. Its content targets the 2027 alpha toolchain, same as this bench, **not** the current-season practice bot — it's a good place to see v3 idioms in a full robot program while comparing against Team 177's v2/v3 pair, but don't point rookies there for their first command-based subsystem; that's what `Getting-Started`/`exercises.html` (Commands v2, current stable) are for.

---

## 2. Background for beginners

Read this section if any of the terms below are new. Skip it if you already know them.

### What is a Raspberry Pi?

A small single-board computer, roughly credit-card sized, that runs Linux. It has a processor, RAM, USB ports, Ethernet, WiFi, and a 40-pin connector along one edge called the **GPIO header** (General Purpose Input/Output) for connecting electronics.

### Why a Pi at all?

SystemCore is itself built on Raspberry Pi silicon — a Compute Module 5 — so a Pi 5 running the SystemCore operating system behaves remarkably like the real thing. It is *not* identical (the real unit has more CAN buses, a built-in IMU, and proper robot power input), but it's close enough to compile against, deploy to, and spin a motor with.

### What is CAN?

**CAN** (Controller Area Network) is the two-wire communication bus that connects everything electrical on an FRC robot. Every Kraken motor, the Pigeon gyro, the CANcoders, the power distribution module — all of them are wired in a daisy chain on two wires called **CANH** and **CANL**.

Think of it like a party line telephone: every device is on the same pair of wires, every device hears every message, and each message carries a device ID so devices know which messages are for them.

**CAN FD** ("Flexible Data-rate") is a newer version of CAN that moves more data per message. SystemCore uses CAN FD natively. Classic CAN 2.0 hardware **cannot** do this — which is why the specific chip on our HAT matters (see below).

### What is a HAT?

**HAT** = *Hardware Attached on Top*. It's the official Raspberry Pi standard for add-on boards that plug directly onto the 40-pin GPIO header. HATs carry a small ID chip so the Pi can recognize the board at boot.

**Why we need one:** the roboRIO has a CAN port built in. **A Raspberry Pi has no CAN hardware whatsoever.** Without a HAT, there is physically nothing to plug a Kraken into. The HAT *is* the Pi's CAN port.

A CAN HAT contains three things:
- **A CAN controller chip** — builds and decodes CAN messages. Ours is the **MCP2518FD**, which supports CAN FD. (The cheaper MCP2515 is classic CAN only — wrong chip for us.)
- **A transceiver chip** — converts the controller's logic-level signals into the actual differential voltages on the CANH/CANL wires.
- **A 120Ω termination resistor** on a jumper — a CAN bus needs one of these at each physical end or messages get corrupted by signal reflections.

### What is SPI?

**SPI** (Serial Peripheral Interface) is a fast wire protocol the Pi uses to talk to chips on add-on boards. Our CAN controller is connected to the Pi over SPI, not built into the Pi's processor. That's why some of the setup below involves telling Linux "there is an MCP2518FD chip on this SPI bus, at this chip-select pin, with a 40MHz clock crystal." Once Linux knows, the CAN bus shows up as a network interface named something like `can0`.

### What is an "image" and "burning" it?

A disk **image** (`.img` file) is a byte-for-byte copy of an entire drive, including the operating system. **Burning** it means writing that copy onto a microSD card so the Pi can boot from it. Raspberry Pi Imager and balenaEtcher both do this. It completely erases the card.

### What is SSH / SCP?

- **SSH** — a way to get a text command line on another computer over the network.
- **SCP** — "secure copy," a way to copy files to another computer over that same connection.

You'll only need SCP if you take Path B.

---

## 3. Hardware we purchased

All from PiShop.us:

| Item | Notes |
|---|---|
| **Raspberry Pi 5, 4GB** | 4GB specifically — closest match to SystemCore's spec. Don't spend up to 8GB. |
| **Waveshare 2-CH CAN FD HAT** (part **17075**) | Must be the **MCP2518FD** version. The near-identically-named MCP2515 board is classic CAN only. |
| **Active Cooler** | The Pi 5 throttles without it. |
| **Case** | See clearance warning in §5. |
| **Official 27W USB-C power supply** | Do not substitute a phone charger. The Pi 5 will brown out. |

**Still needed:**

| Item | Notes |
|---|---|
| **microSD card, 32GB+ — buy TWO** | Class 10 / A2 recommended. The second card is not optional; see §4.1. |
| **CAN wire + a spare Kraken X60** | Pulled from inventory. |
| **A 12V supply for the motor** | A spare battery on a breaker, or a bench supply. The Pi's USB-C supply does **not** power motors. |
| **USB CANivore** *(optional, already owned)* | See §8. |

---

## 4. Software you need to download

| Software | Where |
|---|---|
| **Raspberry Pi Imager** | https://www.raspberrypi.com/software/ |
| **WPILib 2027 alpha** — *pin deliberately, see §4.1* | https://github.com/wpilibsuite/allwpilib/releases |
| **Bobcat prebuilt FD image** | Linked from the `fd/` folder of the Bobcat repo (Google Drive link) |
| **SystemCore OS base image** *(Path B only)* | https://github.com/LimelightVision/systemcore-os-public/releases |
| **CANivore drivers** *(optional)* | `https://ctre.download/files/systemcore/canivore-usb-kernel_1.18_aarch64.ipk` and `https://ctre.download/files/systemcore/canivore-usb_1.16_aarch64.ipk` |
| **Phoenix Tuner X** | From CTRE, as usual |
| **FRC Driver Station** | The 2026 install is fine for bench testing |

> **Install WPILib 2027 alpha *alongside* your 2026 install, not over it.** The alpha installs to its own year-versioned folder (`~/wpilib/2027`). Our actual baseline codebase still needs the 2026 toolchain to build and deploy to the practice bot. Do not uninstall 2026.

---

## 4.1 Version pinning — read before upgrading anything

**This is the section that will save you a weekend.** The 2027 alpha ecosystem is four independent release trains — WPILib, SystemCore OS, the vendor libraries, and the dashboards — and they do not move together. Upgrading one of them in isolation is the single most reliable way to turn a working bench into a broken one.

### The rule

> **Pick a pairing and hold it.** WPILib version, SystemCore image, and every vendordep move *together* or not at all. Never upgrade one because it's newer.

### What broke on 3 Sep 2026

WPILib 2027 **alpha 7** shipped with an explicit note that Alpha 6 and prior vendordeps **will not work** with it, and that vendor libraries must be re-imported. SystemCore image 14 landed the same week with its release title literally reading *"REQUIRES WPILIB ALPHA 7 — CHECK VENDORDEP AVAILABILITY FOR ALL OF YOUR DEVICES BEFORE UPGRADING."*

Compatibility as of this writing:

| Library | 2026 stable | 2027 alpha 7 |
|---|---|---|
| WPILib | ✅ | ✅ |
| Phoenix 6 | ✅ | ⚠️ alpha build exists, pinned to alpha-6 |
| PathPlannerLib | ✅ | ❌ no compatible release |
| AdvantageKit | ✅ | ❌ no compatible release (pinned to alpha-6 + image 11) |
| REVLib | ✅ | ⚠️ alpha build exists |

Three of the four libraries our baseline depends on have **no build** that works with current WPILib. There is no combination of vendordep URLs that compiles the full stack on alpha 7 today.

### The two-card strategy

Because of the above, run **two SD cards**, not one. They cost about eight dollars each and this is the whole answer.

| | **Card A — known good** | **Card B — bleeding edge** |
|---|---|---|
| WPILib | alpha-6 | alpha-7 (current) |
| SystemCore image | 11-era (whatever Bobcat's prebuilt uses) | 14 |
| Vendordeps | Phoenix 6 + AdvantageKit resolve | bare WPILib only |
| What it's for | Full-stack tests. The complete telemetry chain end to end. | What's coming. Format and API changes only. |

Card A never changes once it works. Swapping cards swaps benches, and you never risk the one that boots.

### Never OTA a clone

SystemCore's web UI offers an over-the-air `.llupdate` path. **Do not use it on this bench.** That update payload is built for real CM5-based SystemCore hardware, and our entire CAN capability lives in a hand-modified `config.txt` on the boot partition (§7.4). An OS update will very plausibly overwrite it, and you'll be debugging a dead CAN bus on top of a toolchain you just changed.

If you move to a new image, **re-burn the card from the `.zip` and redo §7**. Never OTA.

### Alpha vs. beta images are the same software

Confusing on purpose, apparently. `limelightosr-2027.0.0-alpha14` and `beta14` are built from an **identical source commit with the same build timestamp**. The alpha/beta split refers to SystemCore *hardware revision* — beta units have configuration buttons — not to software maturity. Match whichever variant your current card was derived from.

Release cadence has been roughly monthly (image 11 in June, 12 in July, 13 in August, 14 on 2 September). Chasing every drop is a treadmill. Pin deliberately.

---

## 5. Physical assembly

1. **Attach the Active Cooler to the Pi first.** It clips into two mounting holes and plugs into the small 4-pin fan connector next to the GPIO header. Peel the thermal pad backing.

2. ⚠️ **Case clearance warning.** The official Raspberry Pi 5 case is not designed to close over a HAT, and the Active Cooler conflicts with the case's own lid fan. Expect to run the Pi **lidless** on the bench, or mount the base of the case only. Don't force the lid — you'll crack the cooler or bend the HAT.

3. **Mount the CAN HAT.** The Waveshare board ships with a 2×20 female pin header extender and screws/standoffs. Use them. The extender gives the HAT clearance over the Active Cooler, and the standoffs keep the GPIO connector from flexing every time someone bumps the bench.

4. **Set the HAT jumpers before powering on:**
   - **VIO / level select → 3.3V** (the Pi is a 3.3V device)
   - **120Ω termination → ENABLED** on the channel you're using. On a bench with one motor, the Pi is one physical end of the bus, so it needs termination.

5. **Do not connect motor power yet.** Get the Pi booting and the CAN interfaces up first, with nothing on the bus.

---

## 6. Path A — Prebuilt Bobcat image (recommended first attempt)

Team 177 published a ready-made image for the FD HAT with the `config.txt` and the CAN bring-up service already configured. **Start here.** If it works, you skip all the Linux configuration in Path B.

1. **Download** the FD image (`.zip`) from the `fd/` folder of the Bobcat repo.
2. **Unzip it** to get the `.img` file.
3. **Burn it** to the microSD card using Raspberry Pi Imager (choose *Use custom* and select the `.img`) or balenaEtcher.
4. **Insert the card** into the Pi and power it on. First boot takes a couple of minutes.
5. **Connect to the Pi's WiFi.** The Pi broadcasts a network named **`SYSTEMCORE`**. The password is **`PASSWORD`** — all uppercase, it is case-sensitive.
6. **Open the dashboard** in a browser at **`172.30.0.1`** or **`robot.local`**.

If the dashboard loads, you have a working SystemCore clone. Jump to §8 (CANivore, optional) or §9 (verification).

---

## 7. Path B — Build from the base image (fallback / learning path)

Take this path if the prebuilt image fails, if it's out of date, or if you want students to understand what's actually being configured. This is the process Team 177 documented.

**Prerequisites:** you can burn an SD card, and you can use `scp` from a terminal.

### 7.1 Burn the base image

Burn the SystemCore OS base image from the LimelightVision releases page. Insert the card, boot the Pi.

### 7.2 Connect and open a terminal

Join the **`SYSTEMCORE`** WiFi network (password **`PASSWORD`**), open the web dashboard, and launch the **Terminal** app from the dashboard.

### 7.3 Mount the hidden boot partition

The file that controls how Linux sets up hardware lives on a partition that isn't mounted by default. Create a mount point and mount it:

```bash
sudo mkdir -p /mnt/hardware_boot
sudo mount /dev/mmcblk0p2 /mnt/hardware_boot
```

> **What's happening:** `mmcblk0p2` means "SD card 0, partition 2." Mounting attaches that partition to the folder you just made, so its files become visible there.

### 7.4 Replace `config.txt`

```bash
sudo nano /mnt/hardware_boot/config.txt
```

Delete the entire contents and paste in the contents of Team 177's **`config_with_fd.txt`** (we have the FD HAT — do **not** use the no-FD version). This is what tells Linux the MCP2518FD chip exists and how to talk to it.

Save and exit nano:

```
Ctrl + O
Enter
Ctrl + X
```

> **nano tips for beginners:** nano is a text editor that runs in the terminal. There's no mouse. `Ctrl+O` = write out (save), `Ctrl+X` = exit. The `^` symbols along the bottom of the screen mean "Ctrl."

### 7.5 Unmount and reboot

```bash
sudo umount /mnt/hardware_boot
sudo reboot
```

### 7.6 Copy the CAN setup scripts to the Pi

From **your laptop's** terminal (not the Pi's), in the folder where you cloned the Bobcat repo:

```bash
scp -r systemcore-can-fd-setup systemcore@<pi-address>:/home/systemcore/
```

Replace `<pi-address>` with `robot.local` or `172.30.0.1`.

### 7.7 Run the installer

Back on the Pi's terminal:

```bash
cd ~/systemcore-can-fd-setup
sudo ./install.sh
sudo reboot
```

This installs the device-tree overlay and a systemd service (`can-bringup`) that brings the CAN interfaces up automatically at every boot.

---

## 8. Installing the CANivore drivers

**Optional.** Only needed if you want to test our USB CANivore on the clone.

Install through the web dashboard's package manager (the 4th tile on the main dashboard), *not* from the terminal:

1. Reconnect to the `SYSTEMCORE` network if needed.
2. Open **Add Packages** in the web dashboard.
3. Drag and drop `canivore-usb-kernel_1.18_aarch64.ipk` to install.
4. Drag and drop `canivore-usb_1.16_aarch64.ipk` to install.
5. Reboot.

> Team 177 noted the correct install order between these two isn't fully clear. If it fails, try the other order.

### CANivore vs. HAT — what each one tests

| | USB CANivore | CAN FD HAT (native bus) |
|---|---|---|
| CTRE devices (Kraken, Pigeon, CANcoder) | ✅ | ✅ |
| Non-CTRE devices (REV, Thrifty, **PDH**) | ❌ | ✅ (expected) |
| Setup difficulty | Easy — plug in, install two packages | Harder — image/overlay config |
| What it proves for 2027 | The CTRE USB path still works | **The native SPI CAN FD bus works — this is the new thing** |

The CANivore is the fast path to a spinning motor. The HAT is the path that actually answers our seam questions. **Do both.**

---

## 9. Verification — how you know it worked

Run these from the Pi's terminal.

### Check the CAN interfaces exist

```bash
ip -br link show | grep can_s
```

**Expected:** the first **two** channels appear as physical interfaces; any others show as virtual. Two physical = both HAT channels are alive.

**If nothing appears:** the SPI overlay isn't loading. That's the `config.txt` step (§7.4) or a seating problem on the GPIO header.

### Check the bring-up service is running

```bash
systemctl is-active can-bringup robot
```

**Expected:** `active` for both.

### Check the dashboard

The web dashboard should load and let you set the **team number to 5675**.

---

## 10. Wiring a real CTRE device to the bench

1. **Power off everything.**
2. Wire **CANH → CANH** and **CANL → CANL** from the HAT's CAN_0 screw terminals to the Kraken. Yellow is typically CANH, green is typically CANL in FRC wiring — but verify against the actual device, don't assume.
3. Confirm **termination is enabled** on the HAT (§5) and at the far end of the chain.
4. Wire the Kraken's power leads to a **12V source through a breaker** — a battery or bench supply. The Pi's USB-C supply does not power motors and must not be used for this.
5. **Clamp or bolt the motor down.** An unsecured Kraken under power will move violently.
6. Power on, then open **Phoenix Tuner X** and connect via `robot.local` or the IP address.

### Firmware note (this is confusing on purpose)

Flash the motor to the latest **2026** Phoenix firmware, even though you're deploying 2027 alpha code. Team 177 flagged this explicitly — the 2027 firmware line doesn't exist yet. It is correct and expected to be running 2026 firmware on this bench.

---

## 11. Deploying and running test code

1. Open the **WPILib 2027 alpha** VS Code (separate from your 2026 install).
2. Open one of the example projects from `project_examples/` in the Bobcat repo — there is a **Commands v2** version and a **Commands v3** version.
3. Deploy normally (WPILib command palette → Deploy Robot Code).
4. Open the **FRC Driver Station**, set team **5675**, enable **Teleop**.
5. The motor should spin.

**Deploy both versions.** Note the differences in how commands are declared, scheduled, and bound. Write down what changed. That note is the input to whether our exercise ladder survives 2027 intact.

### Deploying our own `BenchTest` — strip Phoenix 6 for run one

Two things to know before you try this.

**`BenchTest` is written with 2026 imports.** Its three source files use `edu.wpi.first.*`, so it needs a trip through the WPILib 2027 project importer just like anything else. That's correct and expected here — unlike the baseline, which must *not* be imported (§13).

**Cut the Kraken telemetry out for the first run.** The counter, elapsed time, switch state, and the synthetic `Pose2d` circle depend on **nothing but WPILib**. That version deploys against any alpha regardless of what the vendor libraries are doing, and it's the version that answers our highest-priority question. Add the Phoenix 6 motor telemetry back only once you have a clean `.wpilog` parsing.

This is the general pattern for this bench: **when a test doesn't need a vendordep, delete the vendordep.** It makes the test immune to the compatibility mess in §4.1.

**Where logs land:** on SystemCore, `WPILOGWriter` defaults to a USB drive. Internal storage is at `/home/systemcore/logs` if you'd rather not fight USB mounting.

---

## 12. What this bench validates for our codebase

Work through these in order. Record results in this document as you go.

- [ ] **Commands v2 vs. v3 diff.** *(Highest priority.)* What actually changes in a subsystem and command declaration? — affects: the entire teaching guide and all 10 exercises.
- [ ] **WPILOG format compatibility.** Generate a `.wpilog` on the clone, pull it off, and load it into **`frc_5675_unified_wpilog_analyzer_v10.html`** (v9 is superseded — see §16-D). Does it parse? Do entry names, timestamps, and `Pose2d` struct decoding still come through? Check the v10 timestamp readout: does it say what you expect, and at what confidence? — affects: our entire post-match analysis workflow. **Ten-minute test, do it first.**
- [ ] **Run the same log through on both cards.** Card A (alpha-6) then card B (alpha-7), identical program. Alpha 7 changed raw integer timestamps from microseconds to nanoseconds; a log from each side isolates that change cleanly. One log alone leaves you guessing whether a failure was the timestamps or something else.
- [ ] **Live NT4 path without AdvantageKit.** Confirm `DataLogManager` writes files and NT4 struct publishers reach Elastic on the alpha. This is the fallback telemetry stack — verify it works before we need it.
- [x] ~~**AdvantageKit under WPILib 2027 alpha.**~~ **Answered from published sources, 3 Sep 2026 — see §16-F.** v27.0.0-alpha-4 resolves against WPILib alpha-6 + SystemCore image 11 only, and only the skeleton template exists. Decision recorded in §1. Still worth confirming on card A that it actually *builds*, since a published compatibility claim is not the same as a working Gradle resolve.
- [ ] **Phoenix 6 swerve generator output.** Does the generator produce a differently-shaped `TunerConstants`? — affects: `TunerConstants`, `TunerConstantsPractice`, the `SYSTEMCORE-2027:` CAN-bus-construction seam.
- [ ] **CAN bus naming/construction.** What string or object identifies a bus on SystemCore, versus `"rio"` / CANivore name today? — affects: our single CAN access point.
- [ ] **PDH enumeration on the native bus.** Does WPILib's `PowerDistribution` find a PDH over the HAT's CAN FD bus? — affects: our `PowerMonitor` subsystem and its liveness check. **Cannot be tested over a CANivore.**
- [ ] **Vision timestamps.** Does the CTRE timestamp wrapper still behave the same, and is there any sign of the replacement described in Reference B? — affects: our MT1-seed/MT2-gate fusion. *(Note: Limelight builds SystemCore, so LL4-over-NetworkTables is the least likely thing to break.)*

**What this bench does NOT tell us:**
- Final API names. An alpha is not a release. Nothing here is a commitment.
- Real SystemCore behavior — the actual unit has 5 CAN FD buses, a built-in IMU, and different power input.
- ~~Whether PathPlanner has a 2027 build.~~ Answered from published sources: **no compatible release** for current WPILib (§4.1). Recheck when a 2027-targeting stable ships.

> Because we run a **Pigeon 2.0 on CAN**, Team 177's open question about integrating an IMU to match SystemCore's built-in one **does not apply to us**. Our gyro seam is unchanged.

---

## 13. Known gotchas and troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| No `can0`/`can1` interfaces | SPI overlay not loading. Recheck `config.txt` (§7.4); confirm you used the **FD** version. Reseat the HAT. |
| CAN interfaces appear but no devices enumerate | Termination jumper off, CANH/CANL swapped, or device unpowered. Motors need 12V — the Pi doesn't power them. |
| CAN works then randomly drops | Waveshare's own wiki documents a bug in some recent Raspberry Pi OS builds affecting this HAT, with a suggested downgrade to a mid-2024-or-earlier release. May not apply to the SystemCore image, but search this before assuming you miswired. Wiki: https://www.waveshare.com/wiki/2-CH_CAN_FD_HAT |
| Can't find the `SYSTEMCORE` WiFi | Give it 2–3 minutes on first boot. Check the Pi actually booted (green activity LED). |
| WiFi password rejected | It is `PASSWORD` in **all caps**. Case-sensitive. |
| Bought the wrong HAT | If the board says **MCP2515**, it's classic CAN only. Use the no-FD image and scripts — it'll work, but it won't test the thing we care about. |
| 2027 alpha VS Code can't find WPILib | The alpha installs to its own year folder. Make sure you opened the 2027 VS Code, not the 2026 one. |
| Pi randomly reboots / undervoltage warning | Not using the official 27W supply. |
| **Baseline project won't compile: dozens of "package does not exist" for `com.ctre.phoenix6`, `com.pathplanner.lib`, `org.littletonrobotics.junction`** | You opened the **2026 baseline in 2027 VS Code and let it import**. The importer rewrites WPILib imports but cannot bring vendor libraries across. Do not try to repair the imported copy — go back to the pre-import folder and open it in **WPILib VS Code 2026**. See §16-A. |
| A WPILib import error says **"cannot find symbol"** rather than "package does not exist" | That distinction is diagnostic. "Package does not exist" = the library is missing entirely. "Cannot find symbol" = the package resolved but a class moved. `DriverStation.Alliance` is the example we hit — no longer a nested enum in 2027. |
| 2027 VS Code offers to import or upgrade a project | **Decline**, unless you specifically intend to move that project to 2027. Say yes to this on the baseline and you get the row above. |
| Analyzer opens a bench log but every chart is empty | Epoch timestamps. Use analyzer **v10**, which detects them. See §16-D. |
| Analyzer opens a bench log and the data looks fine but the duration is absurd, or the log looks truncated | Nanosecond timestamps read as microseconds. v9 silently clips at its 86400 s filter and hands you partial data that looks real. v10 detects and reports this. See §16-D. |
| Everything worked yesterday and nothing works today | Did someone upgrade one piece of the stack? Read §4.1. |

---

## 14. Safety notes

- **Bolt the motor down.** Every time. No exceptions.
- **Breaker on the 12V line.** Always.
- **Never back-power the Pi through the GPIO header** while the USB-C supply is connected.
- **Power down before changing any CAN wiring.**
- Keep the bench battery on a charger or disconnected — don't leave a battery sitting connected overnight.

---

## 15. Open questions and next steps

**For us (revised 3 Sep 2026 — order matters):**
1. Complete Path A on **card A**, confirm dashboard access. Do not upgrade anything yet.
2. CANivore path first (fastest route to a spinning motor).
3. **Deploy the vendordep-free `BenchTest`, generate a `.wpilog`, and feed it to analyzer v10.** Fastest, highest-value answer available on this bench, and it needs no vendor libraries at all (§11).
4. Deploy both Commands v2 and v3 examples; document the diff. *(Still the highest-priority question overall.)*
5. **Build card B** (WPILib alpha-7 + image 14). Check the Bobcat repo first for a rebuilt FD image; if there isn't one, that's Path B by hand.
6. Re-run the identical `.wpilog` test on card B. Diff the two logs — that isolates the microsecond→nanosecond change.
7. Add the HAT native bus → test PDH enumeration. *(Card A only; Phoenix 6 has no alpha-7 build.)*
8. ~~Check whether AdvantageKit resolves against alpha-6.~~ Answered (§16-F). Confirm it actually builds on card A when convenient.
9. Update every `SYSTEMCORE-2027:` comment in the baseline with what we actually learned.

**Team 177's stated next steps** (worth watching their thread for):
- Adding Thrifty Nova and REV SparkMax test code to the example project
- Mounting the clone to an actual robot
- Integrating an IMU to match the real SystemCore (no plan yet)
- Powering the Pi on-robot via a mitoCANdria or a Zinc, instead of the wall adapter
- Stacking CAN HATs for more channels

**Questions to ask on Chief Delphi** (tag `@aopalka`, `@mazziesv`, `@mustakkazi` in their build thread — they've invited questions):
- Has the WPILOG binary format changed for 2027? Any record-type or struct-encoding changes that would break a custom parser?
- Does `PowerDistribution` enumerate a REV PDH over the HAT's native FD bus?
- Has anyone gotten AdvantageKit building against 2027 alpha-6?
- Has the WPILOG **timestamp epoch and unit** changed on SystemCore — is it epoch-nanoseconds on alpha 7? *(We've written the analyzer to handle all four combinations, but a confirmation saves guessing.)*
- Is anyone running a clone on image 14 + alpha 7 with a working CAN HAT? Did the Bobcat FD image get rebuilt?

---

## Sources

- Bobcat Robotics SystemCore-Clone repo — https://github.com/BobcatRobotics/SystemCore-Clone
- Bobcat build thread post — https://www.chiefdelphi.com/t/team-177-429-bobcat-robotics-program-2026-2027-build-thread/522511/16
- "DIY Systemcore for early learning?" CD thread — https://www.chiefdelphi.com/t/diy-systemcore-for-early-learning/520408
- Waveshare 2-CH CAN FD HAT wiki — https://www.waveshare.com/wiki/2-CH_CAN_FD_HAT
- SystemCore OS releases — https://github.com/LimelightVision/systemcore-os-public/releases
- WPILib releases (all 2027 alphas) — https://github.com/wpilibsuite/allwpilib/releases
- WPILib 2027 changelog — https://docs.wpilib.org/en/latest/docs/yearly-overview/yearly-changelog.html
- SystemCore alpha/beta testing repo — https://github.com/wpilibsuite/SystemcoreTesting
- AdvantageKit 2027 status + known issues — https://github.com/wpilibsuite/SystemcoreTesting/blob/main/AdvantageKit.md
- Phoenix 6 on SystemCore — https://github.com/wpilibsuite/SystemcoreTesting/blob/main/CTR-Phoenix.md
- Phoenix changelog (incl. SystemCore known issues) — https://api.ctr-electronics.com/changelog.html
- Credit: Team 177 credits @DavidMasin's CAN setup work as their starting point.

---

## 16. Findings log

Things we learned that aren't in anyone's documentation, or that are buried where you'd never find them. 🔬 marks a finding. Add an entry every time the bench — or a bad afternoon — teaches you something.

### 🔬 16-A. The 2027 project importer strips vendor libraries *(3 Sep 2026)*

Opening a 2026 project in WPILib VS Code 2027 and accepting the import offer produces a project that cannot compile. The importer does two things and omits a third:

- ✅ Rewrites `edu.wpi.first.*` → `org.wpilib.*` throughout the source.
- ✅ Regenerates the Gradle shell for the 2027 toolchain.
- ❌ Does **not** carry vendor libraries across — and can't, because the 2026 vendordeps have no 2027 artifacts.

Result: every `com.ctre.phoenix6`, `com.pathplanner.lib`, and `org.littletonrobotics.junction` import fails at once, which reads like a catastrophic breakage but is really one missing step.

**Read the error type, not the error count.** `package does not exist` means the library is absent. `cannot find symbol` means the package resolved and a *class* moved. We hit the second on `import org.wpilib.driverstation.DriverStation.Alliance` — `Alliance` is no longer a nested enum in 2027. Seeing a mix of both told us WPILib 2027 was installed and working, and only the vendordeps were missing. That one distinction cut the diagnosis from an afternoon to a minute.

**Rule: the baseline never gets imported.** It lives on 2026 until the full vendor stack exists for 2027. Decline the upgrade prompt every time.

### 🔬 16-B. Vendor libraries, not WPILib, are the binding constraint

Easy to assume the alpha's maturity is what gates us. It isn't. WPILib alpha 7 works fine. What doesn't exist is PathPlannerLib and AdvantageKit builds that resolve against it, plus a Phoenix 6 build newer than alpha-6.

Practical consequence: **judge "can I do X on 2027 yet" by the vendordep matrix, not the WPILib version number.** See §4.1.

### 🔬 16-C. Alpha 7 breaking changes that hit our baseline directly

Not a general changelog — just the ones that touch files we've written:

| Alpha 7 change | What it breaks in our code |
|---|---|
| SmartDashboard / SendableChooser / Sendable replaced by **Telemetry** and **Tunables** APIs; `SendableChooser` → **`Selectable`** | The auto chooser in `RobotContainer` |
| `Alert` moved to **wpiutil**, with added functionality | `SystemHealthCheck` is built entirely on `Alert` |
| All CAN device classes now take a **`CANPort` enum** | The `CanSeam` access point |
| All constants, including enum values, changed to **ALL_CAPS** | Every enum reference in the codebase |
| `Preferences` moved to its own package; some geometry classes moved to `shape` | `RobotIdentity` (Preferences-backed) |
| **Integer raw timestamps are now nanoseconds, not microseconds** | The WPILOG analyzer — see 16-D |
| `AprilTagFields` folded into an integrated `Fields` class | Vision constants |

Separately, from CTRE's own changelog: the Phoenix 6 SystemCore alpha still uses the **2026 field coordinate system**, and WPILib intends to change the field origin and orientation for 2027. That's a landmine for anything pose-related. Watch for it.

### 🔬 16-D. The analyzer had a timestamp bug we hadn't hit yet — v9 is superseded by v10 *(3 Sep 2026)*

Buried in AdvantageKit's known-issues list: WPILib on SystemCore writes **epoch** timestamps (seconds since 1970) rather than time-since-boot. AdvantageScope had to be patched for this; their symptom was logs opening wildly zoomed out.

Ours was worse. v9 hard-coded "relative microseconds" and then filtered out anything past 86400 seconds. Tested against synthetic logs in all four flavors:

| Log flavor | v9 behavior |
|---|---|
| relative µs (2026 roboRIO) | correct |
| relative ns | **4,321 of 9,000 points** — silently truncated at the filter boundary |
| epoch µs (SystemCore) | **empty** — every record silently discarded |
| epoch ns (both changes) | **empty** |
| short relative-ns log (60 s) | 3,000 points, **silently 1000× too long** — passes the filter |

**The truncation case is the dangerous one.** We'd predicted an empty-chart failure and would have recognized it. Partial data that looks plausible is much harder to catch.

**v10 fixes all four.** It prescans record headers before decoding, works out origin and unit from the numbers in the file, reports what it decided and why with a confidence level, and offers a manual override. Silent drops are now counted and displayed. 2026 logs take the identical code path as before — offset `0n`, divisor `1e6` — verified explicitly.

One implementation note worth remembering: epoch nanoseconds land around **1.8e18**, roughly 200× past the largest integer a float64 stores exactly. Subtracting the log start as a JS `Number` quantizes everything to ~256 ns — a 100 ns delta becomes 0 and 1000 ns becomes 1024. v10 does the subtraction in `BigInt` first. If we ever write another parser for this data, that's the trap.

**Caveat:** v10 is validated against synthetic logs built from the WPILOG spec, not a real SystemCore log. The four flavors are our model of what 2027 might produce. If the bench hands us something outside that model, the readout says what it guessed and the override buys time.

### 🔬 16-E. Never OTA a clone; run two SD cards

Covered in §4.1 — repeated here because it's the finding most likely to cost someone a working bench.

### 🔬 16-F. AdvantageKit 2027 status, read properly *(3 Sep 2026)*

The compatibility line in each release note is the whole story, and it's easy to skim past:

| AdvantageKit | WPILib | SystemCore image |
|---|---|---|
| v27.0.0-alpha-1 | alpha-1 | 157 |
| v27.0.0-alpha-2 | alpha-1 | 161–162 |
| v27.0.0-alpha-3 | alpha-2 | 163 & 166 |
| **v27.0.0-alpha-4** (current) | **alpha-6** | **11** |

Pinned to both. So AdvantageKit and current WPILib/SystemCore are mutually exclusive — that's the whole reason card A exists.

Other things worth knowing from their known-issues page:

- **Alert logging is disabled** because WPILib alpha-6 lacked `Alert`. Alpha 7 moved `Alert` into wpiutil, so this looks alpha-6-specific and self-resolving. Our `SystemHealthCheck` foundation is fine; what lags is AdvantageKit *mirroring* alerts into the log file, which is a nice-to-have.
- `LoggedRobot` still works and is the `TimedRobot` equivalent. No `OpModeRobot` equivalent yet.
- Console logging can lag ~250 ms behind the robot program.
- Four of seven known issues are already struck through as fixed, across AdvantageKit, AdvantageScope, and the OS image. **This is an actively maintained port, not a stalled one.** The lag is scheduling, not abandonment.

### 🔬 16-G. Newer SystemCore images have native Limelight and Hailo support

Recent images added USB camera support on all four ports, a **cameras tab** that enumerates attached Limelights and Hailo accelerators, WebRTC streams through the built-in Elastic package, and support for both USB (LL3A, LL3G) and ethernet (LL4, LL3, LL2) Limelights.

Directly relevant to our LL4-plus-Hailo setup, and it may replace some of what we do by hand today. Not a bench priority right now — telemetry format first — but flag it for spring.

---

## Revision log

| Date | Change | By |
|---|---|---|
| 2026-08-10 | Initial version, written from Bobcat Robotics guide v1.0 | — |
| 2026-09-03 | Added §4.1 (version pinning, two-card strategy, no-OTA rule) and §16 (findings log). Recorded the importer trap (16-A), alpha-7 breaking changes (16-C), the analyzer timestamp bug and v10 fix (16-D), and resolved the AdvantageKit question (16-F). Updated §11, §12, §13, §15 and Sources to match. | Ed |
| | *Add a row every time you learn something on the bench.* | |
