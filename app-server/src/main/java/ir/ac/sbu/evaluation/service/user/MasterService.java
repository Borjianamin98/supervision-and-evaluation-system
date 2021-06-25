package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.report.RefereeReportItemDto;
import ir.ac.sbu.evaluation.dto.report.ScoreCountDto;
import ir.ac.sbu.evaluation.dto.review.peer.AggregatedPeerReviewsDto;
import ir.ac.sbu.evaluation.dto.review.peer.PeerReviewDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterSaveDto;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.review.PeerReviewRepository;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MasterService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final MasterRepository masterRepository;
    private final FacultyRepository facultyRepository;

    private final PeerReviewRepository peerReviewRepository;
    private final ProblemRepository problemRepository;

    public MasterService(PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            PersonalInfoRepository personalInfoRepository,
            MasterRepository masterRepository,
            FacultyRepository facultyRepository,
            PeerReviewRepository peerReviewRepository,
            ProblemRepository problemRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.masterRepository = masterRepository;
        this.facultyRepository = facultyRepository;
        this.peerReviewRepository = peerReviewRepository;
        this.problemRepository = problemRepository;
    }

    public Page<MasterDto> retrieveMasters(String nameQuery, Pageable pageable) {
        return masterRepository.findByFirstNameContainsOrLastNameContains(nameQuery, nameQuery, pageable)
                .map(MasterDto::from);
    }

    @Transactional
    public MasterDto save(MasterSaveDto masterSaveDto) {
        if (userRepository.findByUsername(masterSaveDto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username exists: ID = " + masterSaveDto.getUsername());
        }
        Faculty faculty = facultyRepository.findById(masterSaveDto.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found: ID = "
                        + masterSaveDto.getFacultyId()));

        Master master = masterSaveDto.toMaster();
        master.setPassword(passwordEncoder.encode(master.getPassword()));
        master.setFaculty(faculty);

        PersonalInfo savedInfo = personalInfoRepository.save(master.getPersonalInfo());
        master.setPersonalInfo(savedInfo);

        return MasterDto.from(masterRepository.save(master));
    }

    public MasterDto retrieveMaster(long userId) {
        return MasterDto.from(getMaster(userId));
    }


    public AggregatedPeerReviewsDto retrieveMasterPeerReviews(long masterId, Pageable pageable) {
        Page<PeerReviewDto> peerReviews = peerReviewRepository.findAllByReviewedId(masterId, pageable)
                .map(PeerReviewDto::from);

        List<ScoreCountDto> scoreCounts = peerReviewRepository.aggregatedReviewScoresByReviewedId(masterId);
        Map<Integer, Long> scoreCountsMapping = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            // Provide zero value for not available scores.
            scoreCountsMapping.put(i, 0L);
        }
        for (ScoreCountDto scoreCount : scoreCounts) {
            scoreCountsMapping.put(scoreCount.getScore(), scoreCount.getCount());
        }

        long sumScore = scoreCounts.stream().mapToLong(s -> s.getScore() * s.getCount()).sum();
        long totalScores = scoreCounts.stream().mapToLong(ScoreCountDto::getCount).sum();
        double averageScore = totalScores == 0 ? 0.0 : sumScore * 1.0 / totalScores;
        return AggregatedPeerReviewsDto.builder()
                .averageScore(averageScore)
                .scoresCount(scoreCountsMapping)
                .peerReviews(peerReviews)
                .build();
    }

    public Page<RefereeReportItemDto> retrieveMasterRefereeReport(long masterId, Pageable pageable) {
        return problemRepository.masterProblemRefereeReport(masterId, ProblemState.COMPLETED, pageable);
    }

    public Master getMaster(long userId) {
        return masterRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Master not found: ID = " + userId));
    }
}
