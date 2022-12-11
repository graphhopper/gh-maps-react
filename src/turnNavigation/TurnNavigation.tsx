import React, { useState } from 'react'
import { metersToText, milliSecondsToText } from '@/Converters'
import { getTurnSign } from '@/sidebar/instructions/Instructions'
import styles from '@/turnNavigation/TurnNavigation.module.css'
import EndNavigation from '@/sidebar/times-solid.svg'
import { TurnNavigationStoreState } from '@/stores/TurnNavigationStore'
import Dispatcher from '@/stores/Dispatcher'
import { SelectMapLayer, TurnNavigationStop, ZoomMapToPoint } from '@/actions/Actions'
import PlainButton from '@/PlainButton'

export default function ({ turnNavigation }: { turnNavigation: TurnNavigationStoreState }) {
    if (turnNavigation.activePath == null) new Error('activePath cannot be null if TurnNavigation is enabled')
    const instruction = turnNavigation.instruction
    const pd = turnNavigation.pathDetails

    let [showTime, setShowTime] = useState(true)
    let [showDebug, setShowDebug] = useState(false)

    const arrivalDate = new Date()
    const currentSpeed = Math.round(turnNavigation.speed * 3.6)
    arrivalDate.setMilliseconds(arrivalDate.getSeconds() + instruction.timeToEnd)
    const min = arrivalDate.getMinutes()

    return (
        <>
            <div className={styles.turnInfo}>
                <div className={styles.turnSign}>
                    <div>{getTurnSign(instruction.sign, instruction.index, instruction.nextWaypointIndex)}</div>
                    <div>{metersToText(instruction.distanceToTurn, false)}</div>
                </div>
                <div className={styles.turnInfoRightSide}>
                    <div className={styles.arrival}>
                        <div onClick={() => setShowTime(!showTime)}>
                            {showTime ? (
                                <div>
                                    {arrivalDate.getHours() + ':' + (min > 9 ? min : '0' + min)}
                                    <svg width="30" height="8">
                                        <circle cx="5" cy="4" r="3" />
                                        <circle cx="20" cy="4" r="3.5" stroke="black" fill="white" />
                                    </svg>
                                </div>
                            ) : (
                                <div>
                                    {milliSecondsToText(instruction.timeToEnd)}
                                    <svg width="30" height="8">
                                        <circle cx="5" cy="4" r="3" stroke="black" fill="white" />
                                        <circle cx="20" cy="4" r="3.5" />
                                    </svg>
                                </div>
                            )}
                            <div className={styles.remainingDistance}>
                                {metersToText(instruction.distanceToEnd, false)}
                            </div>
                        </div>
                        <div onClick={() => setShowDebug(!showDebug)}>
                            <div>{currentSpeed} km/h</div>
                            {pd.maxSpeed != null ? (
                                <div className={styles.maxSpeed}>{Math.round(pd.maxSpeed)}</div>
                            ) : null}
                            {showDebug ? (
                                <div className={styles.debug}>
                                    <div>{pd.estimatedAvgSpeed}</div>
                                    <div>{pd.surface}</div>
                                    <div>{pd.roadClass}</div>
                                </div>
                            ) : null}
                        </div>
                        <PlainButton
                            className={styles.thirdCol}
                            onClick={() => {
                                Dispatcher.dispatch(new SelectMapLayer(turnNavigation.oldTiles))
                                Dispatcher.dispatch(new TurnNavigationStop())
                                Dispatcher.dispatch(new ZoomMapToPoint(turnNavigation.coordinate, 15, 0, false, 0))
                            }}
                        >
                            <EndNavigation />
                        </PlainButton>
                    </div>
                    <div>{instruction.text}</div>
                </div>
            </div>
        </>
    )
}