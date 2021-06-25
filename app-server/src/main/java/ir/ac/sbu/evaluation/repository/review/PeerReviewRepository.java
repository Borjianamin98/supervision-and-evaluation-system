package ir.ac.sbu.evaluation.repository.review;

import ir.ac.sbu.evaluation.model.review.PeerReview;
import ir.ac.sbu.evaluation.model.review.ScoreCount;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PeerReviewRepository extends JpaRepository<PeerReview, Long> {

    Page<PeerReview> findAllByReviewedId(long reviewedId, Pageable pageable);

    @Query("select new ir.ac.sbu.evaluation.model.review.ScoreCount(p.score, COUNT(p)) " +
            "from PeerReview p " +
            "where p.reviewed.id = :reviewedId " +
            "group by p.score")
    List<ScoreCount> findAggregatedReviewScoresByReviewedId(
            @Param("reviewedId") long reviewedId);
}
